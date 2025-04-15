const express = require('express');
const router = express.Router();
const DataController = require('../controllers/DataController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// Define routes
router.get('/', DataController.getAllData);
router.get('/:id', DataController.getDataById);
router.post('/', DataController.createData);
router.put('/:id', DataController.updateData);
router.patch('/:id', DataController.patchData);
router.delete('/:id', DataController.deleteData);

module.exports = router;
