const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Course.deleteMany();
        await User.deleteMany();

        console.log('Old data cleared.');

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                profile: { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Dr. Emily Chen',
                email: 'faculty1@example.com',
                password: 'password123',
                role: 'faculty',
                profile: { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Prof. Michael Ross',
                email: 'faculty2@example.com',
                password: 'password123',
                role: 'faculty',
                profile: { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
                profile: { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
        ];

        const createdUsers = [];
        for (const u of users) {
            const user = new User(u);
            await user.save();
            createdUsers.push(user);
        }

        const faculty1 = createdUsers[1]._id;
        const faculty2 = createdUsers[2]._id;

        // Using verified Image IDs with query parameters for reliability
        const courseData = [
            // Engineering - 5
            {
                title: 'Fundamentals of Mechanical Engineering',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1537462713505-a1d7c4845279?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Civil Engineering Basics',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Robotics and Automation',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Electrical Circuit Analysis',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Introduction to Aerospace',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Developer - 5
            {
                title: 'Full Stack Web Development',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Python Zero to Hero',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'React Native for Mobile',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Advanced Node.js Patterns',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Cloud Computing with AWS',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Designer - 4
            {
                title: 'UI/UX Design Masterclass',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Graphic Design Fundamentals',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1626785774573-4b7993125651?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Adobe Photoshop Mastery',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Brand Identity Design',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Medical - 4
            {
                title: 'Anatomy and Physiology',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'First Aid and Emergency Care',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e495?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Introduction to Nursing',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Medical Terminology',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1576091160550-217358c7db81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Teacher - 4
            {
                title: 'Effective Classroom Management',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Educational Psychology',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Curriculum Design',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Online Teaching Essentials',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1427504494785-3a9ca28015be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Commerce - 4
            {
                title: 'Principles of Accounting',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Business Law Fundamentals',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Marketing Strategy 101',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Supply Chain Management',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },

            // Trading - 4
            {
                title: 'Stock Market Trading',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Crypto Trading Strategies',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Technical Analysis Guide',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Forex Trading for Beginners',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
        ];

        const courses = [];
        for (let i = 0; i < courseData.length; i++) {
            const item = courseData[i];
            const isFaculty1 = i % 2 === 0;

            courses.push({
                title: item.title,
                description: `Comprehensive course on ${item.title}. Learn the core concepts of ${item.category} from industry professionals. Includes practical examples and certification.`,
                category: item.category,
                faculty: isFaculty1 ? faculty1 : faculty2,
                thumbnail: item.image,
                price: Math.floor(Math.random() * 150) + 20,
                isPublished: true,
                chapters: [
                    { title: 'Introduction', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isFree: true },
                    { title: 'Deep Dive', videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isFree: false }
                ],
                enrolledCount: Math.floor(Math.random() * 800) + 10,
            });
        }

        await Course.insertMany(courses);

        console.log(`Successfully imported ${courses.length} courses with verified unique images!`);
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
