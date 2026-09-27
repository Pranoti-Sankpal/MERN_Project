// ============================================================
// Complaint CRUD + workflow actions.
//
// Ownership rules (enforced on every read/write):
//   CUSTOMER -> can only access complaints where customer_id === req.user.id
//   EMPLOYEE -> can only access complaints where assigned_employee_id === req.user.id
//   ADMIN    -> can access everything
// ============================================================
const { pool } = require('../config/db');
const { success, error } = require('../utils/apiResponse');
const { isNonEmptyString, isValidPriority } = require('../utils/validators');
const { isValidTransition, getNextValidStatuses } = require('../utils/statusTransitions');

const COMPLAINT_SELECT = `
  SELECT
    c.id, c.customer_id, c.category_id, c.assigned_employee_id,
    c.subject, c.description, c.priority, c.status, c.resolution_remarks,
    c.created_at, c.updated_at, c.resolved_at, c.closed_at,
    cust.name AS customer_name, cust.email AS customer_email,
    emp.name AS employee_name, emp.email AS employee_email,
    cat.name AS category_name
  FROM complaints c
  LEFT JOIN users cust ON cust.id = c.customer_id
  LEFT JOIN users emp ON emp.id = c.assigned_employee_id
  LEFT JOIN complaint_categories cat ON cat.id = c.category_id
`;

// Fetches one raw complaint row (no joins) - used internally for auth/ownership checks.
async function findComplaintRaw(id) {
  const [rows] = await pool.query('SELECT * FROM complaints WHERE id = ?', [id]);
  return rows[0] || null;
}

function canAccessComplaint(user, complaint) {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'CUSTOMER') return Number(complaint.customer_id) === Number(user.id);
  if (user.role === 'EMPLOYEE') return Number(complaint.assigned_employee_id) === Number(user.id);
  return false;
}

// POST /api/complaints  (Customer only)
async function createComplaint(req, res, next) {
  try {
    const { subject, description, category_id, priority } = req.body;

    if (!isNonEmptyString(subject, 200)) return error(res, 400, 'Subject is required (max 200 characters).');
    if (!isNonEmptyString(description, 5000)) return error(res, 400, 'Description is required.');

    let finalPriority = 'MEDIUM';
    if (priority !== undefined) {
      if (!isValidPriority(priority)) return error(res, 400, 'Invalid priority value.');
      finalPriority = priority;
    }

    let categoryId = null;
    if (category_id !== undefined && category_id !== null && category_id !== '') {
      const [cat] = await pool.query('SELECT id FROM complaint_categories WHERE id = ?', [category_id]);
      if (cat.length === 0) return error(res, 400, 'Invalid category.');
      categoryId = category_id;
    }

    const [result] = await pool.query(
      `INSERT INTO complaints (customer_id, category_id, subject, description, priority, status)
       VALUES (?, ?, ?, ?, ?, 'SUBMITTED')`,
      [req.user.id, categoryId, subject.trim(), description.trim(), finalPriority]
    );

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [result.insertId]);

    return success(res, 201, 'Complaint created successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// GET /api/complaints  (role-scoped list, with filters)
async function getComplaints(req, res, next) {
  try {
    const { status, priority, category_id, assigned_employee_id, search } = req.query;
    const conditions = [];
    const params = [];

    if (req.user.role === 'CUSTOMER') {
      conditions.push('c.customer_id = ?');
      params.push(req.user.id);
    } else if (req.user.role === 'EMPLOYEE') {
      conditions.push('c.assigned_employee_id = ?');
      params.push(req.user.id);
    }
    // ADMIN: no ownership restriction

    if (status) {
      conditions.push('c.status = ?');
      params.push(status);
    }
    if (priority) {
      conditions.push('c.priority = ?');
      params.push(priority);
    }
    if (category_id) {
      conditions.push('c.category_id = ?');
      params.push(category_id);
    }
    if (assigned_employee_id && req.user.role === 'ADMIN') {
      conditions.push('c.assigned_employee_id = ?');
      params.push(assigned_employee_id);
    }
    if (search) {
      conditions.push('(c.subject LIKE ? OR c.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    let query = COMPLAINT_SELECT;
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.query(query, params);
    return success(res, 200, 'Complaints fetched successfully.', { complaints: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/complaints/:id
async function getComplaintById(req, res, next) {
  try {
    const { id } = req.params;
    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (!canAccessComplaint(req.user, raw)) {
      return error(res, 403, 'Forbidden. You do not have access to this complaint.');
    }

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint fetched successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id  (Admin: category/priority; Customer: subject/description while SUBMITTED)
async function updateComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (!canAccessComplaint(req.user, raw)) {
      return error(res, 403, 'Forbidden. You do not have access to this complaint.');
    }

    const { subject, description, category_id, priority } = req.body;
    const updates = [];
    const params = [];

    if (req.user.role === 'CUSTOMER') {
      if (Number(raw.customer_id) !== Number(req.user.id)) {
        return error(res, 403, 'Forbidden.');
      }
      if (raw.status !== 'SUBMITTED') {
        return error(res, 400, 'Complaint can only be edited while in SUBMITTED status.');
      }
      if (subject !== undefined) {
        if (!isNonEmptyString(subject, 200)) return error(res, 400, 'Subject cannot be empty.');
        updates.push('subject = ?');
        params.push(subject.trim());
      }
      if (description !== undefined) {
        if (!isNonEmptyString(description, 5000)) return error(res, 400, 'Description cannot be empty.');
        updates.push('description = ?');
        params.push(description.trim());
      }
    }

    if (req.user.role === 'ADMIN') {
      if (category_id !== undefined) {
        updates.push('category_id = ?');
        params.push(category_id);
      }
      if (priority !== undefined) {
        if (!isValidPriority(priority)) return error(res, 400, 'Invalid priority value.');
        updates.push('priority = ?');
        params.push(priority);
      }
    }

    if (updates.length === 0) {
      return error(res, 400, 'No valid fields to update.');
    }

    params.push(id);
    await pool.query(`UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`, params);

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint updated successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/complaints/:id  (Admin only)
async function deleteComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    await pool.query('DELETE FROM complaints WHERE id = ?', [id]);
    return success(res, 200, 'Complaint deleted successfully.');
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id/assign  (Admin only) - sets category, employee, priority; SUBMITTED -> ASSIGNED
async function assignComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { category_id, assigned_employee_id, priority } = req.body;

    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (!assigned_employee_id) return error(res, 400, 'assigned_employee_id is required.');

    const [empRows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [assigned_employee_id]);
    if (empRows.length === 0 || empRows[0].role !== 'EMPLOYEE') {
      return error(res, 400, 'assigned_employee_id must reference a valid employee.');
    }

    if (category_id) {
      const [cat] = await pool.query('SELECT id FROM complaint_categories WHERE id = ?', [category_id]);
      if (cat.length === 0) return error(res, 400, 'Invalid category.');
    }

    if (priority && !isValidPriority(priority)) {
      return error(res, 400, 'Invalid priority value.');
    }

    if (!isValidTransition(raw.status, 'ASSIGNED')) {
      return error(
        res,
        400,
        `Cannot assign complaint from status ${raw.status}. Valid next statuses: ${getNextValidStatuses(raw.status).join(', ') || 'none'}.`
      );
    }

    await pool.query(
      `UPDATE complaints
       SET category_id = COALESCE(?, category_id),
           assigned_employee_id = ?,
           priority = COALESCE(?, priority),
           status = 'ASSIGNED'
       WHERE id = ?`,
      [category_id || null, assigned_employee_id, priority || null, id]
    );

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint assigned successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id/status  (Employee, owner only) - generic transition, e.g. ASSIGNED -> IN_PROGRESS
async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return error(res, 400, 'status is required.');

    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (req.user.role === 'EMPLOYEE' && Number(raw.assigned_employee_id) !== Number(req.user.id)) {
      return error(res, 403, 'Forbidden. This complaint is not assigned to you.');
    }
    if (req.user.role === 'CUSTOMER') {
      return error(res, 403, 'Forbidden. Customers cannot change complaint status directly.');
    }

    if (!isValidTransition(raw.status, status)) {
      return error(
        res,
        400,
        `Invalid status transition from ${raw.status} to ${status}. Valid next statuses: ${getNextValidStatuses(raw.status).join(', ') || 'none'}.`
      );
    }

    await pool.query('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint status updated successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id/resolve  (Employee, owner only) - IN_PROGRESS -> RESOLVED, requires remarks
async function resolveComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const { resolution_remarks } = req.body;

    if (!isNonEmptyString(resolution_remarks, 5000)) {
      return error(res, 400, 'Resolution remarks are required to resolve a complaint.');
    }

    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (req.user.role !== 'EMPLOYEE' || Number(raw.assigned_employee_id) !== Number(req.user.id)) {
      return error(res, 403, 'Forbidden. Only the assigned employee can resolve this complaint.');
    }

    if (!isValidTransition(raw.status, 'RESOLVED')) {
      return error(
        res,
        400,
        `Cannot resolve complaint from status ${raw.status}. Valid next statuses: ${getNextValidStatuses(raw.status).join(', ') || 'none'}.`
      );
    }

    await pool.query(
      `UPDATE complaints SET status = 'RESOLVED', resolution_remarks = ?, resolved_at = NOW() WHERE id = ?`,
      [resolution_remarks.trim(), id]
    );

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint resolved successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/complaints/:id/close  (Customer owner, or Admin) - RESOLVED -> CLOSED
async function closeComplaint(req, res, next) {
  try {
    const { id } = req.params;
    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    const isOwnerCustomer = req.user.role === 'CUSTOMER' && Number(raw.customer_id) === Number(req.user.id);
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwnerCustomer && !isAdmin) {
      return error(res, 403, 'Forbidden. Only the customer who filed this complaint or an admin can close it.');
    }

    if (!isValidTransition(raw.status, 'CLOSED')) {
      return error(
        res,
        400,
        `Cannot close complaint from status ${raw.status}. A complaint must be RESOLVED before it can be closed.`
      );
    }

    await pool.query(`UPDATE complaints SET status = 'CLOSED', closed_at = NOW() WHERE id = ?`, [id]);

    const [rows] = await pool.query(`${COMPLAINT_SELECT} WHERE c.id = ?`, [id]);
    return success(res, 200, 'Complaint closed successfully.', { complaint: rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/complaints/:id/comments
async function addComment(req, res, next) {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!isNonEmptyString(comment, 2000)) return error(res, 400, 'Comment cannot be empty.');

    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (!canAccessComplaint(req.user, raw)) {
      return error(res, 403, 'Forbidden. You do not have access to this complaint.');
    }

    const [result] = await pool.query(
      'INSERT INTO complaint_comments (complaint_id, user_id, comment) VALUES (?, ?, ?)',
      [id, req.user.id, comment.trim()]
    );

    const [rows] = await pool.query(
      `SELECT cc.id, cc.complaint_id, cc.user_id, cc.comment, cc.created_at, u.name AS user_name, u.role AS user_role
       FROM complaint_comments cc JOIN users u ON u.id = cc.user_id WHERE cc.id = ?`,
      [result.insertId]
    );

    return success(res, 201, 'Comment added successfully.', { comment: rows[0] });
  } catch (err) {
    next(err);
  }
}

// GET /api/complaints/:id/comments
async function getComments(req, res, next) {
  try {
    const { id } = req.params;
    const raw = await findComplaintRaw(id);
    if (!raw) return error(res, 404, 'Complaint not found.');

    if (!canAccessComplaint(req.user, raw)) {
      return error(res, 403, 'Forbidden. You do not have access to this complaint.');
    }

    const [rows] = await pool.query(
      `SELECT cc.id, cc.complaint_id, cc.user_id, cc.comment, cc.created_at, u.name AS user_name, u.role AS user_role
       FROM complaint_comments cc JOIN users u ON u.id = cc.user_id
       WHERE cc.complaint_id = ? ORDER BY cc.created_at ASC`,
      [id]
    );

    return success(res, 200, 'Comments fetched successfully.', { comments: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  assignComplaint,
  updateStatus,
  resolveComplaint,
  closeComplaint,
  addComment,
  getComments,
};
