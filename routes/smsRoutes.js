const express = require('express');
const router = express.Router();
const SMSController = require('../controllers/SMSController');
const auth = require('../middleware/auth');

// Send verification code
router.post('/send-verification', auth, SMSController.sendVerificationCode);

// Verify phone number
router.post('/verify', auth, SMSController.verifyPhoneNumber);

// Send custom message (admin only)
router.post('/send-custom', auth, SMSController.sendCustomMessage);

module.exports = router; 