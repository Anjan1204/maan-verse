const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createUserDirect() {
    try {
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/maanverse';
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        // Delete existing test users
        await User.deleteMany({ 
            email: { $in: ['admin@example.com', 'faculty1@example.com', 'faculty2@example.com', 'student@example.com'] }
        });
        
        // Create password hash using the same method as User model
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        console.log('Hashed password:', hashedPassword);
        
        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isApproved: true,
            isMainAdmin: true
        });
        
        console.log('Admin created:', admin.email);
        
        // Verify immediately
        const verifyUser = await User.findOne({ email: 'admin@example.com' });
        const isMatch = await bcrypt.compare('password123', verifyUser.password);
        console.log('Immediate password verification:', isMatch);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createUserDirect();
