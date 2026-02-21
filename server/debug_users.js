const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debugUsers() {
    try {
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/maanverse';
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        const User = require('./models/User');
        
        // Find all users
        const users = await User.find({});
        console.log('\n=== Users in Database ===');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Role: ${u.role}, isApproved: ${u.isApproved}`);
            console.log(`  Password hash: ${u.password.substring(0, 20)}...`);
        });
        
        // Test password
        if (users.length > 0) {
            const user = users[0];
            console.log(`\n=== Testing password for ${user.email} ===`);
            const isMatch = await bcrypt.compare('password123', user.password);
            console.log(`Password match: ${isMatch}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

debugUsers();
