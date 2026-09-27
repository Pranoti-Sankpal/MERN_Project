const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/complaintController');
const { authenticate } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.post('/', allowRoles('CUSTOMER'), createComplaint);
router.get('/', getComplaints); // scoped by role inside controller
router.get('/:id', getComplaintById); // ownership checked inside controller
router.put('/:id', updateComplaint); // ownership + role checked inside controller
router.delete('/:id', allowRoles('ADMIN'), deleteComplaint);

router.put('/:id/assign', allowRoles('ADMIN'), assignComplaint);
router.put('/:id/status', allowRoles('EMPLOYEE', 'ADMIN'), updateStatus);
router.put('/:id/resolve', allowRoles('EMPLOYEE'), resolveComplaint);
router.put('/:id/close', allowRoles('CUSTOMER', 'ADMIN'), closeComplaint);

router.post('/:id/comments', addComment); // ownership checked inside controller
router.get('/:id/comments', getComments); // ownership checked inside controller

module.exports = router;
