const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Define routes
router.get('/', ProductController.getAllData);
router.get('/:id', ProductController.getDataById);
router.post('/', ProductController.createData);
router.put('/:id', ProductController.updateData);
router.patch('/:id', ProductController.patchData);
router.delete('/:id', ProductController.deleteData);

module.exports = router;
