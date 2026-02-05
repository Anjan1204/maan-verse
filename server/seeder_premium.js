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
                profile: { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Dr. Emily Chen',
                email: 'faculty1@example.com',
                password: 'password123',
                role: 'faculty',
                profile: { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Prof. Michael Ross',
                email: 'faculty2@example.com',
                password: 'password123',
                role: 'faculty',
                profile: { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password123',
                role: 'student',
                profile: { avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
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

        // 30 Unique Courses with Unique Images
        const courseData = [
            // Engineering (5)
            {
                title: 'Fundamentals of Mechanical Engineering',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1537462713505-a1d7c4845279?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Civil Engineering Basics',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Robotics and Automation',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Electrical Circuit Analysis',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1517420704952-d9f39714aafd?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Introduction to Aerospace',
                category: 'Engineering',
                image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80'
            },

            // Developer (5)
            {
                title: 'Full Stack Web Development',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Python Zero to Hero',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'React Native for Mobile',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Advanced Node.js Patterns',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Cloud Computing with AWS',
                category: 'Developer',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
            },

            // Designer (4)
            {
                title: 'UI/UX Design Masterclass',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Graphic Design Fundamentals',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1626785774573-4b7993125651?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Adobe Photoshop Mastery',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Brand Identity Design',
                category: 'Designer',
                image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=800&q=80'
            },

            // Medical (4)
            {
                title: 'Anatomy and Physiology',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1576091160550-217358c7db81?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'First Aid and Emergency Care',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1516574187841-69301976e495?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Introduction to Nursing',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Medical Terminology',
                category: 'Medical',
                image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'
            },

            // Teacher (4)
            {
                title: 'Effective Classroom Management',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Educational Psychology',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Curriculum Design',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Online Teaching Essentials',
                category: 'Teacher',
                image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80'
            },

            // Commerce (4)
            {
                title: 'Principles of Accounting',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Business Law Fundamentals',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Marketing Strategy 101',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Supply Chain Management',
                category: 'Commerce',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
            },

            // Trading (4)
            {
                title: 'Stock Market Trading',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Crypto Trading Strategies',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Technical Analysis Guide',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Forex Trading for Beginners',
                category: 'Trading',
                image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4963c?auto=format&fit=crop&w=800&q=80'
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

        console.log(`Successfully imported ${courses.length} courses with unique images!`);
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
