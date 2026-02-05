const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String }, // Path or URL to video
    pdfUrl: { type: String },   // Path or URL to PDF
    isFree: { type: Boolean, default: false },
});

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String, // Or ObjectId if using Category model
        required: true,
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    chapters: [chapterSchema],
    enrolledCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
