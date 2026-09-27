// ============================================================
// Authentication: register (customer only), login (all roles),
// and profile retrieval.
// ============================================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { success, error } = require('../utils/apiResponse');
const { isValidEmail, isValidPassword, isNonEmptyString } = require('../utils/validators');

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

// POST /api/auth/register
// Public registration is always for a CUSTOMER account.
// Employee accounts are created by Admin via /api/users/employees.
async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!isNonEmptyString(name, 100)) return error(res, 400, 'Name is required.');
    if (!isValidEmail(email)) return error(res, 400, 'A valid email is required.');
    if (!isValidPassword(password)) return error(res, 400, 'Password must be at least 6 characters.');

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return error(res, 409, 'An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hashedPassword, phone || null, 'CUSTOMER']
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || null,
      role: 'CUSTOMER',
    };

    const token = signToken(newUser);

    return success(res, 201, 'Registration successful.', { user: newUser, token });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || typeof password !== 'string' || password.length === 0) {
      return error(res, 400, 'Email and password are required.');
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return error(res, 401, 'Invalid email or password.');
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return error(res, 401, 'Invalid email or password.');
    }

    const token = signToken(user);
    delete user.password;

    return success(res, 200, 'Login successful.', { user, token });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/profile
async function getProfile(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return error(res, 404, 'User not found.');
    }

    return success(res, 200, 'Profile fetched successfully.', { user: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile };
