const axios = require('axios');

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@example.com',
            password: 'password123'
        });
        console.log('Login successful!');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('Login failed!');
        console.log('Status:', error.response?.status);
        console.log('Message:', error.response?.data?.message || error.message);
    }
};

testLogin();
