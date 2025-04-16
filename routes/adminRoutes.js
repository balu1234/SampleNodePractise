const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/AdminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure multer for file uploads with error handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept all file types for now, you can add restrictions here
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }
    next(err);
};

// Apply protect middleware to all routes
router.use(protect);

// Apply admin middleware to all routes
router.use(admin);

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Send email route with error handling
router.post('/send-email', 
    upload.single('attachment'),
    handleMulterError,
    adminController.sendEmail
);

module.exports = router; 