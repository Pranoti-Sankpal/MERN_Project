// ============================================================
// Verifies the JWT sent in the Authorization header and attaches
// the decoded { id, role } payload to req.user for downstream use.
// ============================================================
const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 401, 'Not authorized. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return error(res, 401, 'Not authorized. Invalid or expired token.');
  }
}

module.exports = { authenticate };
