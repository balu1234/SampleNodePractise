const express = require('express');
const router = express.Router();
const TagController = require('../controllers/TagController');
const { protect } = require('../middleware/authMiddleware');

// Protect all tag routes
router.use(protect);

// Define routes
router.get('/', TagController.getAllTags);
router.get('/:id', TagController.getTagById);
router.post('/', TagController.createTag);
router.put('/:id', TagController.updateTag);
router.delete('/:id', TagController.deleteTag);

module.exports = router; 