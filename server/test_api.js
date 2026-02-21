const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Login Success!');
        console.log(response.data);
    } catch (error) {
        console.log('Login Failed!');
        console.log(error.response?.data || error.message);
    }
}

testLogin();
