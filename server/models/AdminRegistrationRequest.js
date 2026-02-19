const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminRegistrationRequestSchema = mongoose.Schema({
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
        default: 'admin',
    }
}, {
    timestamps: true,
});

const AdminRegistrationRequest = mongoose.model('AdminRegistrationRequest', adminRegistrationRequestSchema);
module.exports = AdminRegistrationRequest;
