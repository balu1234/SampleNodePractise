const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Apply admin middleware to all routes
router.use(admin);

// User management routes
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.post('/users', AdminController.createUser);
router.put('/users/:id', AdminController.updateUser);
router.delete('/users/:id', AdminController.deleteUser);

module.exports = router; 