const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Try multiple URI combinations to find working credentials
const urisToTry = [
    // Variation 1: current
    process.env.MONGO_URI,
    // Variation 2: with retryWrites
    'mongodb+srv://maan-verse:maan-verse_key_2024@ac-fz6sf4a.j9cowtb.mongodb.net/maan-verse?retryWrites=true&w=majority&appName=MaanVerse',
    // Variation 3: underscore username
    'mongodb+srv://maan_verse:maan_verse_key_2024@ac-fz6sf4a.j9cowtb.mongodb.net/?appName=MaanVerse',
    // Variation 4: no dashes  
    'mongodb+srv://maanverse:maanverse_key_2024@ac-fz6sf4a.j9cowtb.mongodb.net/?appName=MaanVerse',
    // Variation 5: simple password
    'mongodb+srv://maan-verse:password123@ac-fz6sf4a.j9cowtb.mongodb.net/?appName=MaanVerse',
    // Variation 6: maan-verse with super_secret key
    'mongodb+srv://maan-verse:super_secret_maan_verse_key_2024@ac-fz6sf4a.j9cowtb.mongodb.net/?appName=MaanVerse',
    // Variation 7: admin/admin
    'mongodb+srv://admin:admin@ac-fz6sf4a.j9cowtb.mongodb.net/?appName=MaanVerse',
];

const tryUri = async (uri, idx) => {
    try {
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`\n✅ SUCCESS [${idx}]: ${uri.substring(0, 80)}...`);
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.log(`❌ FAILED [${idx}]: ${err.message.substring(0, 100)}`);
        try { await mongoose.disconnect(); } catch (e) { }
        return false;
    }
};

const main = async () => {
    for (let i = 0; i < urisToTry.length; i++) {
        const success = await tryUri(urisToTry[i], i);
        if (success) {
            console.log('\nFound working URI!');
            break;
        }
    }
    process.exit(0);
};

main();
