const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { protect } = require('../middleware/authMiddleware');

// Protect all category routes
router.use(protect);

// Define routes
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', CategoryController.createCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router; 