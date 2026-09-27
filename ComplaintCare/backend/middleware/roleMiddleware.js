// ============================================================
// Restricts a route to a set of allowed roles.
// Must run AFTER authenticate() so req.user is populated.
// Usage: router.get('/', authenticate, allowRoles('ADMIN'), handler)
// ============================================================
const { error } = require('../utils/apiResponse');

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 401, 'Not authorized.');
    }
    if (!roles.includes(req.user.role)) {
      return error(res, 403, 'Forbidden. You do not have permission to perform this action.');
    }
    next();
  };
}

module.exports = { allowRoles };
