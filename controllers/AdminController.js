const User = require('../models/User');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    console.log('Creating new user with data:', req.body);
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await newUser.save();
    console.log('User created successfully:', { id: newUser._id, username, email, role: newUser.role });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message,
      details: error.stack 
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, phoneNumber } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.sendEmail = async (req, res) => {
    try {
        const { email, subject, message } = req.body;
        const attachment = req.file;

        console.log('Email request received:', { email, subject, message, attachment });

        // Validate required fields
        if (!email || !subject || !message) {
            return res.status(400).json({ 
                message: 'Email, subject, and message are required fields' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Invalid email format' 
            });
        }

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.error('Email credentials missing in environment variables');
            return res.status(500).json({ 
                message: 'Email configuration is missing. Please check your environment variables.' 
            });
        }

        // Create a transporter with secure configuration
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        try {
            await transporter.verify();
            console.log('Email server connection verified');
        } catch (error) {
            console.error('Email configuration error:', error);
            return res.status(500).json({ 
                message: 'Email configuration error. Please check your credentials.',
                error: error.message 
            });
        }

        // Email options
        const mailOptions = {
            from: `"Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: message,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`
        };

        // Add attachment if present
        if (attachment) {
            console.log('Adding attachment:', attachment.originalname);
            mailOptions.attachments = [{
                filename: attachment.originalname,
                path: attachment.path
            }];
        }

        // Send email
        console.log('Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);

        // Clean up attachment file if it exists
        if (attachment) {
            try {
                fs.unlinkSync(attachment.path);
                console.log('Attachment file cleaned up successfully');
            } catch (error) {
                console.error('Error cleaning up attachment:', error);
            }
        }

        res.status(200).json({ 
            message: 'Email sent successfully',
            info: info.response 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            message: 'Error sending email', 
            error: error.message,
            details: error.stack 
        });
    }
}; 