// ============================================================
// User management (Admin only for list/create/delete).
// A user may always view/update their own profile via /:id
// as long as ownership or admin role is satisfied.
// ============================================================
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { success, error } = require('../utils/apiResponse');
const { isValidEmail, isValidPassword, isNonEmptyString } = require('../utils/validators');

const SALT_ROUNDS = 10;

// GET /api/users?role=CUSTOMER|EMPLOYEE|ADMIN  (Admin only)
async function getUsers(req, res, next) {
  try {
    const { role } = req.query;
    let query = 'SELECT id, name, email, phone, role, created_at FROM users';
    const params = [];

    if (role && ['ADMIN', 'EMPLOYEE', 'CUSTOMER'].includes(role)) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return success(res, 200, 'Users fetched successfully.', { users: rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id  (Admin, or the user themselves)
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (req.user.role !== 'ADMIN' && Number(req.user.id) !== Number(id)) {
      return error(res, 403, 'Forbidden. You can only view your own profile.');
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return error(res, 404, 'User not found.');
    return success(res, 200, 'User fetched successfully.', { user: rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/employees  (Admin only)
async function createEmployee(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!isNonEmptyString(name, 100)) return error(res, 400, 'Name is required.');
    if (!isValidEmail(email)) return error(res, 400, 'A valid email is required.');
    if (!isValidPassword(password)) return error(res, 400, 'Password must be at least 6 characters.');

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) return error(res, 409, 'An account with this email already exists.');

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hashedPassword, phone || null, 'EMPLOYEE']
    );

    const newEmployee = {
      id: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      role: 'EMPLOYEE',
    };

    return success(res, 201, 'Employee account created successfully.', { user: newEmployee });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id  (Admin, or the user themselves - limited fields)
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (req.user.role !== 'ADMIN' && Number(req.user.id) !== Number(id)) {
      return error(res, 403, 'Forbidden. You can only update your own profile.');
    }

    const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return error(res, 404, 'User not found.');

    if (name !== undefined && !isNonEmptyString(name, 100)) {
      return error(res, 400, 'Name must not be empty.');
    }

    await pool.query('UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone) WHERE id = ?', [
      name ? name.trim() : null,
      phone !== undefined ? phone : null,
      id,
    ]);

    const [updated] = await pool.query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    return success(res, 200, 'User updated successfully.', { user: updated[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id  (Admin only)
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (Number(req.user.id) === Number(id)) {
      return error(res, 400, 'You cannot delete your own account.');
    }

    const [rows] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return error(res, 404, 'User not found.');

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return success(res, 200, 'User deleted successfully.');
  } catch (err) {
    next(err);
  }
}

module.exports = { getUsers, getUserById, createEmployee, updateUser, deleteUser };
