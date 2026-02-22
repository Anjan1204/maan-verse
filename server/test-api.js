const axios = require('axios');

const testApi = async () => {
    try {
        console.log('--- Testing /api/courses ---');
        const resCourses = await axios.get('http://localhost:5000/api/courses');
        console.log(`Status: ${resCourses.status}`);
        console.log(`Courses Count: ${resCourses.data.length}`);

        console.log('\n--- Testing /api/courses/categories/stats ---');
        const resStats = await axios.get('http://localhost:5000/api/courses/categories/stats');
        console.log(`Status: ${resStats.status}`);
        console.log('Stats Data:', JSON.stringify(resStats.data, null, 2));

    } catch (error) {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
};

testApi();
