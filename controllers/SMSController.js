const User = require('../models/User');
const { sendSMS, sendVerificationCode } = require('../utils/twilioService');
const crypto = require('crypto');

exports.sendVerificationCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        
        // Update user with verification code
        user.phoneVerificationCode = verificationCode;
        user.phoneVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // Send verification code via SMS
        await sendVerificationCode(phoneNumber, verificationCode);

        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ message: 'Error sending verification code', error: error.message });
    }
};

exports.verifyPhoneNumber = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if code matches and hasn't expired
        if (user.phoneVerificationCode !== code || 
            user.phoneVerificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Mark phone as verified
        user.isPhoneVerified = true;
        user.phoneVerificationCode = undefined;
        user.phoneVerificationCodeExpires = undefined;
        await user.save();

        res.json({ message: 'Phone number verified successfully' });
    } catch (error) {
        console.error('Error verifying phone number:', error);
        res.status(500).json({ message: 'Error verifying phone number', error: error.message });
    }
};

exports.sendCustomMessage = async (req, res) => {
    try {
        const { phoneNumber, message } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can send custom messages' });
        }

        // Send custom message
        const result = await sendSMS(phoneNumber, message);

        res.json({
            message: 'SMS sent successfully',
            details: result
        });
    } catch (error) {
        console.error('Error sending custom message:', error);
        res.status(500).json({ message: 'Error sending custom message', error: error.message });
    }
}; 