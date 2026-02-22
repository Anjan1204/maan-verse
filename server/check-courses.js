const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

const checkCourses = async () => {
    try {
        await connectDB();
        const total = await Course.countDocuments();
        const published = await Course.countDocuments({ isPublished: true });
        console.log(`Total Courses: ${total}`);
        console.log(`Published Courses: ${published}`);

        if (published > 0) {
            const sample = await Course.findOne({ isPublished: true });
            console.log('Sample Course:', JSON.stringify(sample, null, 2));
        }

        mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCourses();
