const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'faculty', 'student'],
        default: 'student',
    },
    isApproved: {
        type: Boolean,
        default: true, // Default to true for students/faculty, handled in controller for admins
    },
    isMainAdmin: {
        type: Boolean,
        default: false,
    },
    profile: {
        bio: String,
        avatar: String,
    },
    // Detailed Student Profile
    studentProfile: {
        rollNo: String,
        branch: String,
        semester: String,
        phone: String,
        dob: Date,
        address: String,
    },
    // Detailed Faculty Profile
    facultyProfile: {
        employeeId: String,
        department: String,
        designation: String,
        subjects: [String], // Array of subject names
        phone: String,
        joinDate: Date,
    },
    // For students
    attendance: {
        totalClasses: { type: Number, default: 0 },
        presentClasses: { type: Number, default: 0 },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    }
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
