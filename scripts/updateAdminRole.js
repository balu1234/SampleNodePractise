require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const updateAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find and update the admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(0);
    }

    adminUser.role = 'admin';
    await adminUser.save();
    console.log('Admin role updated successfully');

  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    process.exit(0);
  }
};

updateAdminRole(); 