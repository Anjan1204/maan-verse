const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const TimetableSchema = new mongoose.Schema({
    branch: String,
    semester: String,
    day: String,
    slots: Array,
    isPublished: Boolean
});
const Timetable = mongoose.model('Timetable', TimetableSchema, 'timetables');

const fs = require('fs');
async function diag() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let output = '';

        output += '--- USER DATA ---\n';
        const Users = mongoose.connection.db.collection('users');
        const students = await Users.find({ role: 'student' }).toArray();
        students.forEach(s => {
            output += `[STUDENT] Name: ${s.name}, Branch: "${s.studentProfile?.branch}", Sem: "${s.studentProfile?.semester}"\n`;
        });

        output += '\n--- TIMETABLE DATA ---\n';
        const Timetable = mongoose.connection.db.collection('timetables');
        const entries = await Timetable.find({}).toArray();

        output += `Total Timetable entries: ${entries.length}\n`;
        entries.forEach(e => {
            output += `[ENTRY] ID: ${e._id}, Day: ${e.day}, Sem: "${e.semester}", Branch: "${e.branch}", Published: ${e.isPublished}\n`;
        });

        fs.writeFileSync('diag_output.txt', output);
        console.log('Diagnostic written to diag_output.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

diag();
