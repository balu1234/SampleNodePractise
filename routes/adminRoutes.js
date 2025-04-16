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
        // Preserve original filename and extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept PDF and other common file types
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, and GIF files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
        files: 1 // Only allow one file
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File size too large. Maximum size is 100MB.',
                error: err.message
            });
        }
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: 'File upload error',
            error: err.message
        });
    }
    next();
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