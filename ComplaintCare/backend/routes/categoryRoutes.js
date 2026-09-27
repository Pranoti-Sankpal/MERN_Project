const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/', getCategories);
router.post('/', allowRoles('ADMIN'), createCategory);
router.put('/:id', allowRoles('ADMIN'), updateCategory);
router.delete('/:id', allowRoles('ADMIN'), deleteCategory);

module.exports = router;
