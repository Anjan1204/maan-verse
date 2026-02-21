const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const cleanData = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('Error: MONGO_URI not found in .env file');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected successfully.');

        // List of models to clear (Transactional Data)
        const modelsToClear = [
            'Fee',
            'LeaveRequest',
            'FacultyInquiry',
            'Enrollment',
            'Notification',
            'Message',
            'Conversation',
            'Attendance',
            'Payroll',
            'Exam',
            'Result',
            'Submission',
            'Badge',
            'Timetable',
            'Notice',
            'AdminRegistrationRequest',
            'Assignment',
            'Contact',
            'Certificate',
            'ForumComment',
            'ForumThread'
        ];

        console.log('\n--- Starting Cleanup ---');

        for (const modelName of modelsToClear) {
            try {
                // Determine the model file path
                const modelPath = path.join(__dirname, 'models', `${modelName}.js`);
                const Model = require(modelPath);

                const result = await Model.deleteMany({});
                console.log(`[CLEANED] ${modelName}: ${result.deletedCount} records removed.`);
            } catch (err) {
                console.warn(`[SKIP] Could not clear ${modelName}: ${err.message}`);
            }
        }

        console.log('\n--- Cleanup Finished ---');
        console.log('NOTE: User and Course data were NOT cleared. Run "node seeder.js" if you want to reset them too.');

        process.exit(0);
    } catch (error) {
        console.error('Fatal Error:', error.message);
        process.exit(1);
    }
};

cleanData();
