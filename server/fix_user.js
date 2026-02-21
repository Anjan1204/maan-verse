const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixUser() {
    try {
        // Manually set the MONGO_URI
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/maanverse';
        process.env.JWT_SECRET = 'super_secret_maan_verse_key_2024';
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const result = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { 
                password: hashedPassword, 
                name: 'Admin User',
                role: 'admin',
                isApproved: true,
                isMainAdmin: true
            },
            { upsert: true, new: true }
        );
        
        console.log('Admin user fixed!');
        console.log('Email: admin@example.com');
        console.log('Password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixUser();
