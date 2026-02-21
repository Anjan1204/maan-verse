const axios = require('axios');

async function testLogin() {
    try {
        // Test student login
        const studentResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'student@example.com',
            password: 'password123'
        });
        console.log('Student login SUCCESS:', studentResponse.data);
    } catch (error) {
        console.log('Student login FAILED:', error.response?.data || error.message);
    }

    try {
        // Test faculty login
        const facultyResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'faculty1@example.com',
            password: 'password123'
        });
        console.log('Faculty login SUCCESS:', facultyResponse.data);
    } catch (error) {
        console.log('Faculty login FAILED:', error.response?.data || error.message);
    }

    try {
        // Test admin login
        const adminResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Admin login SUCCESS:', adminResponse.data);
    } catch (error) {
        console.log('Admin login FAILED:', error.response?.data || error.message);
    }
}

testLogin();
