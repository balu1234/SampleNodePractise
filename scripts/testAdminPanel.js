const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';
let adminToken = '';

// Test admin login
async function testAdminLogin() {
    try {
        console.log('Testing admin login...');
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });
        
        adminToken = response.data.token;
        console.log('✅ Admin login successful');
        return true;
    } catch (error) {
        console.error('❌ Admin login failed:', error.response?.data || error.message);
        return false;
    }
}

// Test get all users
async function testGetAllUsers() {
    try {
        console.log('\nTesting get all users...');
        const response = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        console.log('✅ Get all users successful');
        console.log('Users:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Get all users failed:', error.response?.data || error.message);
        return false;
    }
}

// Test create user
async function testCreateUser() {
    try {
        console.log('\nTesting create user...');
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'test123',
            role: 'user'
        };
        console.log('Sending user data:', userData);
        
        const response = await axios.post(`${API_URL}/admin/users`, userData, {
            headers: { 
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Create user successful');
        console.log('Created user:', response.data);
        return response.data.user.id;
    } catch (error) {
        console.error('❌ Create user failed');
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request was made but no response received');
            console.error(error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return null;
    }
}

// Test update user
async function testUpdateUser(userId) {
    try {
        console.log('\nTesting update user...');
        const response = await axios.put(`${API_URL}/admin/users/${userId}`, {
            username: 'updateduser',
            email: 'updateduser@example.com',
            role: 'admin'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        console.log('✅ Update user successful');
        console.log('Updated user:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Update user failed:', error.response?.data || error.message);
        return false;
    }
}

// Test delete user
async function testDeleteUser(userId) {
    try {
        console.log('\nTesting delete user...');
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        console.log('✅ Delete user successful');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Delete user failed:', error.response?.data || error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('Starting admin panel tests...\n');
    
    // Test admin login
    const loginSuccess = await testAdminLogin();
    if (!loginSuccess) {
        console.log('\n❌ Admin panel tests failed at login step');
        return;
    }
    
    // Test get all users
    const getUsersSuccess = await testGetAllUsers();
    if (!getUsersSuccess) {
        console.log('\n❌ Admin panel tests failed at get users step');
        return;
    }
    
    // Test create user
    const userId = await testCreateUser();
    if (!userId) {
        console.log('\n❌ Admin panel tests failed at create user step');
        return;
    }
    
    // Test update user
    const updateSuccess = await testUpdateUser(userId);
    if (!updateSuccess) {
        console.log('\n❌ Admin panel tests failed at update user step');
        return;
    }
    
    // Test delete user
    const deleteSuccess = await testDeleteUser(userId);
    if (!deleteSuccess) {
        console.log('\n❌ Admin panel tests failed at delete user step');
        return;
    }
    
    console.log('\n✅ All admin panel tests completed successfully!');
}

// Run the tests
runTests().catch(error => {
    console.error('Test execution error:', error);
}); 