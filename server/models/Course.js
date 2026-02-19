const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String }, // Path or URL to video
    pdfUrl: { type: String },   // Path or URL to PDF
    isFree: { type: Boolean, default: false },
    quiz: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // Index of the correct option
    }],
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
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: 'Self-paced'
    },
    learningOutcomes: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    resources: [{
        title: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, enum: ['PDF', 'Link', 'Video', 'Other'], default: 'PDF' }
    }],
    enrolledCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
