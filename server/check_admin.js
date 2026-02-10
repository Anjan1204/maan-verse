const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const checkAdmin = async () => {
    try {
        const users = await User.find({ role: 'admin' }).limit(5);

        if (users.length > 0) {
            console.log(`Found ${users.length} admins:`);
            users.forEach(user => {
                console.log(`--------------------------------`);
                console.log(`Name: ${user.name}`);
                console.log(`Email: ${user.email}`);
                console.log(`Role: ${user.role}`);
                console.log(`isApproved: ${user.isApproved}`);
                console.log(`isMainAdmin: ${user.isMainAdmin}`);
            });
        } else {
            console.log('No admins found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkAdmin();
