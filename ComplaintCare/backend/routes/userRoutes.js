const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createEmployee, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

router.get('/', allowRoles('ADMIN'), getUsers);
router.post('/employees', allowRoles('ADMIN'), createEmployee);
router.get('/:id', getUserById); // ownership checked inside controller
router.put('/:id', updateUser); // ownership checked inside controller
router.delete('/:id', allowRoles('ADMIN'), deleteUser);

module.exports = router;
