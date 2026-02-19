const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    icon: {
        type: String, // String representation of Lucide icon or URL
        required: true,
    },
    criteria: {
        type: String, // e.g. "Complete 5 courses", "Score 90+ in Quiz"
    },
    recipients: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        awardedAt: {
            type: Date,
            default: Date.now,
        }
    }]
}, {
    timestamps: true,
});

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;
