const express = require('express');
const router = express.Router();
const {
  getStats,
  getCategoryBreakdown,
  getPriorityBreakdown,
  getRecentComplaints,
} = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/stats', getStats);
router.get('/categories', getCategoryBreakdown);
router.get('/priorities', getPriorityBreakdown);
router.get('/recent', getRecentComplaints);

module.exports = router;
