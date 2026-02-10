const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const restoreAdmin = async () => {
    try {
        const adminEmail = 'admin@example.com';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists.');
        } else {
            console.log('Admin user not found. Creating...');
            const adminUser = new User({
                name: 'Admin User',
                email: adminEmail,
                password: 'password123',
                role: 'admin',
            });

            await adminUser.save();
            console.log('Admin user restored successfully!');
            console.log('Email: admin@example.com');
            console.log('Password: password123');
        }

        process.exit();
    } catch (error) {
        console.error('Error restoring admin:', error);
        process.exit(1);
    }
};

restoreAdmin();
