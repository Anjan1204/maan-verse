const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors');
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Faculty One',
                email: 'faculty1@example.com',
                password: 'password123',
                role: 'faculty',
            },
            {
                name: 'Faculty Two',
                email: 'faculty2@example.com',
                password: 'password123',
                role: 'faculty',
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
            },
        ];

        // Create Users manually to trigger pre-save hook for password hashing
        const createdUsers = [];
        for (const u of users) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
        }

        const faculty1 = createdUsers[1]._id;
        const faculty2 = createdUsers[2]._id;

        const courses = [];
        const categories = ['Development', 'Business', 'Design', 'Marketing', 'Photography', 'Music'];

        const categoryImages = {
            'Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            'Business': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
            'Marketing': 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
            'Photography': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
            'Music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
        };

        for (let i = 1; i <= 55; i++) {
            const isFaculty1 = i % 2 === 0;
            const category = categories[Math.floor(Math.random() * categories.length)];
            courses.push({
                title: `${category} Course Masterclass ${i}`,
                description: `This is a comprehensive course about ${category}. Learn from the best sources and master the skills required for ${category}. Index: ${i}`,
                category: category,
                faculty: isFaculty1 ? faculty1 : faculty2,
                thumbnail: categoryImages[category] || `https://via.placeholder.com/640x360.png?text=Course+${i}`,
                price: Math.floor(Math.random() * 100) + 10,
                isPublished: true,
                chapters: [
                    { title: 'Introduction', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isFree: true },
                    { title: 'Advanced Concepts', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isFree: false }
                ],
                enrolledCount: Math.floor(Math.random() * 500),
            });
        }

        await Course.insertMany(courses);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
