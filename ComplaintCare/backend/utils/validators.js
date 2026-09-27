// ============================================================
// Lightweight backend validation helpers.
// Frontend validation exists too, but the backend must never
// trust it - every field is re-validated here.
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['ADMIN', 'EMPLOYEE', 'CUSTOMER'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function isNonEmptyString(value, maxLength = 5000) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isValidRole(role) {
  return VALID_ROLES.includes(role);
}

function isValidPriority(priority) {
  return VALID_PRIORITIES.includes(priority);
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
  isValidRole,
  isValidPriority,
  VALID_ROLES,
  VALID_PRIORITIES,
};
