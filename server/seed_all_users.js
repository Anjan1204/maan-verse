const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedAllUsers() {
    try {
        // Manually set the MONGO_URI
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/maanverse';
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Delete old users and create fresh ones
        await User.deleteMany({});
        
        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isApproved: true,
            isMainAdmin: true
        });
        console.log('Admin created:', admin.email);
        
        // Create Faculty 1
        const faculty1 = await User.create({
            name: 'Faculty One',
            email: 'faculty1@example.com',
            password: hashedPassword,
            role: 'faculty',
            isApproved: true,
            facultyProfile: {
                employeeId: 'FAC001',
                department: 'Computer Science',
                designation: 'Professor',
                subjects: ['Data Structures', 'Algorithms'],
                baseSalary: 50000
            }
        });
        console.log('Faculty 1 created:', faculty1.email);
        
        // Create Faculty 2
        const faculty2 = await User.create({
            name: 'Faculty Two',
            email: 'faculty2@example.com',
            password: hashedPassword,
            role: 'faculty',
            isApproved: true,
            facultyProfile: {
                employeeId: 'FAC002',
                department: 'Mathematics',
                designation: 'Associate Professor',
                subjects: ['Calculus', 'Linear Algebra'],
                baseSalary: 45000
            }
        });
        console.log('Faculty 2 created:', faculty2.email);
        
        // Create Student
        const student = await User.create({
            name: 'Student User',
            email: 'student@example.com',
            password: hashedPassword,
            role: 'student',
            isApproved: true,
            studentProfile: {
                rollNo: 'STU001',
                branch: 'Computer Science',
                semester: '6th'
            }
        });
        console.log('Student created:', student.email);
        
        console.log('\n=== All Users Seeded Successfully ===');
        console.log('Email: admin@example.com | Password: password123 | Role: Admin');
        console.log('Email: faculty1@example.com | Password: password123 | Role: Faculty');
        console.log('Email: faculty2@example.com | Password: password123 | Role: Faculty');
        console.log('Email: student@example.com | Password: password123 | Role: Student');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

seedAllUsers();
