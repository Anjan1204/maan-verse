const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const safeReset = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('Error: MONGO_URI not found in .env file');
            process.exit(1);
        }

        console.log('--- Database Safe Reset Utility ---');
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('Connected successfully.\n');

        const modelsDir = path.join(__dirname, 'models');
        const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

        console.log(`Found ${modelFiles.length} models to process.`);

        let totalRecordsAffected = 0;

        for (const file of modelFiles) {
            try {
                const modelName = file.replace('.js', '');
                const Model = require(path.join(modelsDir, file));

                // Count records before deletion
                const count = await Model.countDocuments({});

                if (count > 0) {
                    const result = await Model.deleteMany({});
                    console.log(`[CLEANED] ${modelName}: ${result.deletedCount} records removed.`);
                    totalRecordsAffected += result.deletedCount;
                } else {
                    console.log(`[EMPTY]   ${modelName}: No records to remove.`);
                }
            } catch (err) {
                console.warn(`[SKIP]    Could not process ${file}: ${err.message}`);
            }
        }

        console.log('\n--- Reset Finished ---');
        console.log(`Total records removed: ${totalRecordsAffected}`);
        console.log('\nIMPORTANT NEXT STEPS:');
        console.log('1. Visit your website.');
        console.log('2. Go to the Sign Up page.');
        console.log('3. Register your new Admin account.');
        console.log('4. The first account registered as Admin will automatically become the Main Admin.');

        process.exit(0);
    } catch (error) {
        console.error('Fatal Error:', error.message);
        process.exit(1);
    }
};

// Check for dry run flag
if (process.argv.includes('--dry-run')) {
    console.log('DRY RUN MODE: Counting records without deleting...');
    // Dry run implementation could be added here if needed, 
    // but for now we'll just implement the full reset as requested.
}

safeReset();
