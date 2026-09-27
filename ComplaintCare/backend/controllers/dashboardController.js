// ============================================================
// Dashboard statistics.
// Admin sees system-wide stats; Employee/Customer see scoped stats
// via the same endpoints (query is adjusted by role).
// ============================================================
const { pool } = require('../config/db');
const { success } = require('../utils/apiResponse');

function scopeClause(user) {
  if (user.role === 'CUSTOMER') return { clause: 'WHERE customer_id = ?', params: [user.id] };
  if (user.role === 'EMPLOYEE') return { clause: 'WHERE assigned_employee_id = ?', params: [user.id] };
  return { clause: '', params: [] };
}

// GET /api/dashboard/stats
async function getStats(req, res, next) {
  try {
    const { clause, params } = scopeClause(req.user);

    const [rows] = await pool.query(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) AS submitted,
        SUM(CASE WHEN status = 'ASSIGNED' THEN 1 ELSE 0 END) AS assigned,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved,
        SUM(CASE WHEN status = 'CLOSED' THEN 1 ELSE 0 END) AS closed
       FROM complaints ${clause}`,
      params
    );

    const stats = rows[0];
    // Normalize potential NULL sums (when there are zero rows) to 0.
    Object.keys(stats).forEach((k) => {
      stats[k] = Number(stats[k]) || 0;
    });
    stats.pending = stats.submitted + stats.assigned + stats.in_progress;

    return success(res, 200, 'Dashboard stats fetched successfully.', { stats });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/categories - complaints grouped by category
async function getCategoryBreakdown(req, res, next) {
  try {
    const { clause, params } = scopeClause(req.user);
    const whereSql = clause ? clause.replace('WHERE', 'WHERE c.') : '';

    const [rows] = await pool.query(
      `SELECT COALESCE(cat.name, 'Uncategorized') AS category, COUNT(*) AS count
       FROM complaints c
       LEFT JOIN complaint_categories cat ON cat.id = c.category_id
       ${whereSql}
       GROUP BY cat.name
       ORDER BY count DESC`,
      params
    );

    return success(res, 200, 'Category breakdown fetched successfully.', { breakdown: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/priorities - complaints grouped by priority
async function getPriorityBreakdown(req, res, next) {
  try {
    const { clause, params } = scopeClause(req.user);

    const [rows] = await pool.query(
      `SELECT priority, COUNT(*) AS count FROM complaints ${clause} GROUP BY priority ORDER BY FIELD(priority, 'URGENT','HIGH','MEDIUM','LOW')`,
      params
    );

    return success(res, 200, 'Priority breakdown fetched successfully.', { breakdown: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/dashboard/recent - most recent complaints
async function getRecentComplaints(req, res, next) {
  try {
    const { clause, params } = scopeClause(req.user);
    const whereSql = clause ? clause.replace('WHERE', 'WHERE c.') : '';

    const [rows] = await pool.query(
      `SELECT c.id, c.subject, c.priority, c.status, c.created_at,
              cust.name AS customer_name, emp.name AS employee_name, cat.name AS category_name
       FROM complaints c
       LEFT JOIN users cust ON cust.id = c.customer_id
       LEFT JOIN users emp ON emp.id = c.assigned_employee_id
       LEFT JOIN complaint_categories cat ON cat.id = c.category_id
       ${whereSql}
       ORDER BY c.created_at DESC
       LIMIT 10`,
      params
    );

    return success(res, 200, 'Recent complaints fetched successfully.', { complaints: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getCategoryBreakdown, getPriorityBreakdown, getRecentComplaints };
