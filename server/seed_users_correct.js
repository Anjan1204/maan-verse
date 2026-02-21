const mongoose = require('mongoose');

async function seedUsersCorrect() {
    try {
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/maanverse';
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        // Delete existing test users
        await User.deleteMany({ 
            email: { $in: ['admin@example.com', 'faculty1@example.com', 'faculty2@example.com', 'student@example.com'] }
        });
        
        // Create users WITHOUT pre-hashing - let User model's pre-save middleware do it!
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',  // NOT pre-hashed - model will hash it
            role: 'admin',
            isApproved: true,
            isMainAdmin: true
        });
        console.log('Admin created:', admin.email);
        
        const faculty1 = await User.create({
            name: 'Faculty One',
            email: 'faculty1@example.com',
            password: 'password123',
            role: 'faculty',
            isApproved: true,
            facultyProfile: {
                employeeId: 'FAC001',
                department: 'Computer Science',
                designation: 'Professor'
            }
        });
        console.log('Faculty 1 created:', faculty1.email);
        
        const faculty2 = await User.create({
            name: 'Faculty Two',
            email: 'faculty2@example.com',
            password: 'password123',
            role: 'faculty',
            isApproved: true,
            facultyProfile: {
                employeeId: 'FAC002',
                department: 'Mathematics',
                designation: 'Associate Professor'
            }
        });
        console.log('Faculty 2 created:', faculty2.email);
        
        const student = await User.create({
            name: 'Student User',
            email: 'student@example.com',
            password: 'password123',
            role: 'student',
            isApproved: true,
            studentProfile: {
                rollNo: 'STU001',
                branch: 'Computer Science',
                semester: '6th'
            }
        });
        console.log('Student created:', student.email);
        
        // Verify
        const bcrypt = require('bcryptjs');
        const verifyUser = await User.findOne({ email: 'admin@example.com' });
        const isMatch = await bcrypt.compare('password123', verifyUser.password);
        console.log('\nPassword verification:', isMatch ? 'SUCCESS!' : 'FAILED!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

seedUsersCorrect();
