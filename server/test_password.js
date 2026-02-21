const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
};

const testLogin = async () => {
    await connectDB();
    
    const User = require('./models/User');
    
    // Find the admin user
    const user = await User.findOne({ email: 'admin@example.com' });
    
    if (!user) {
        console.log('User not found!');
        process.exit(1);
    }
    
    console.log('User found:', user.email);
    console.log('Stored password (hashed):', user.password);
    
    // Test password matching
    const isMatch = await user.matchPassword('password123');
    console.log('Password match:', isMatch);
    
    // Test with wrong password
    const isMatchWrong = await user.matchPassword('wrongpassword');
    console.log('Wrong password match:', isMatchWrong);
    
    process.exit(0);
};

testLogin();
