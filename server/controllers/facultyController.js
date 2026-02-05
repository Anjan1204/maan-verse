const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const Notice = require('../models/Notice');

// @desc    Get faculty dashboard stats
// @route   GET /api/faculty/dashboard
// @access  Private/Faculty
const getFacultyDashboard = async (req, res, next) => {
    try {
        const facultyId = req.user._id;

        // Stats
        const courses = await Course.countDocuments({ faculty: facultyId });
        const totalStudents = await User.countDocuments({ role: 'student' }); // In a real app, this would be students enrolled in faculty's courses

        // 3. Attendance Chart Data (Real Aggregation)
        // Group attendance by Subject for this faculty's subjects
        // For simplicity, we find all attendance records for subjects this faculty teaches.
        // Assuming facultyProfile.subjects contains strings of subject names
        const mySubjects = req.user.facultyProfile?.subjects || [];

        const attendanceStats = await Attendance.aggregate([
            { $match: { subject: { $in: mySubjects } } },
            { $group: { _id: '$subject', total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } } } },
            { $project: { name: '$_id', attendance: { $multiply: [{ $divide: ['$present', '$total'] }, 100] } } }
        ]);

        // 4. Today's Classes (Real)
        const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        // Matches slots where teacher name matches user name (simple linking as per current model)
        const todaySchedule = await Timetable.find({
            day: todayDay,
            'slots.teacher': req.user.name
        });

        // Flatten schedule to get specific slots
        let formatedSchedule = [];
        todaySchedule.forEach(t => {
            t.slots.forEach(slot => {
                if (slot.teacher === req.user.name) {
                    formatedSchedule.push({
                        time: slot.time,
                        subject: slot.subject,
                        room: slot.room,
                        class: `${t.branch} ${t.semester}`
                    });
                }
            });
        });

        res.json({
            stats: {
                totalCourses: courses,
                totalStudents: totalStudents,
                todayClasses: formatedSchedule.length,
                pendingTasks: 0 // removed mock
            },
            attendanceChart: attendanceStats,
            todaySchedule: formatedSchedule,
            recentActivity: []
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Classes for Attendance
// @route   GET /api/faculty/classes
// @access  Private/Faculty
const getMyClasses = async (req, res, next) => {
    try {
        // Return a list of subjects/classes this faculty teaches
        // For now, return subjects from profile or mock
        const subjects = req.user.facultyProfile?.subjects || ['Computer Networks', 'Database Management'];
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark Attendance
// @route   POST /api/faculty/attendance
// @access  Private/Faculty
const markAttendance = async (req, res, next) => {
    try {
        const { date, subject, students } = req.body;
        // students is array of { studentId, status }

        const records = students.map(s => ({
            student: s.studentId,
            date: date,
            day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            status: s.status,
            subject: subject
        }));

        await Attendance.insertMany(records);
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Students for a Subject/Class
// @route   GET /api/faculty/students
// @access  Private/Faculty
const getStudentsForClass = async (req, res, next) => {
    try {
        // In real app, filter by enrollment in faculty's course
        const students = await User.find({ role: 'student' }).select('name email studentProfile');
        res.json(students);
    } catch (error) {
        next(error);
    }
};


// @desc    Update Faculty Subjects
// @route   POST /api/faculty/subjects
// @access  Private/Faculty
const updateMySubjects = async (req, res, next) => {
    try {
        const { subjects } = req.body;
        // subjects should be an array of strings

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (!user.facultyProfile) {
            user.facultyProfile = {};
        }

        user.facultyProfile.subjects = subjects;
        await user.save();

        res.json({ message: 'Subjects updated successfully', subjects: user.facultyProfile.subjects });
    } catch (error) {
        next(error);
    }
};

// @desc    Add Timetable Slot
// @route   POST /api/faculty/timetable
// @access  Private/Faculty
const addTimetableSlot = async (req, res, next) => {
    try {
        const { branch, semester, day, time, subject, room } = req.body;

        // Validation
        if (!branch || !semester || !day || !time || !subject || !room) {
            res.status(400);
            throw new Error('Please provide all fields');
        }

        // Find existing timetable or create new
        let timetable = await Timetable.findOne({ branch, semester, day });

        if (!timetable) {
            timetable = new Timetable({
                branch,
                semester,
                day,
                slots: []
            });
        }

        // Add slot
        const newSlot = {
            time,
            subject,
            teacher: req.user.name,
            room
        };

        timetable.slots.push(newSlot);
        await timetable.save();

        res.status(201).json(newSlot);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Faculty Timetable
// @route   GET /api/faculty/timetable
// @access  Private/Faculty
const getFacultyTimetable = async (req, res, next) => {
    try {
        // Find all timetables where this faculty is teaching
        const timetables = await Timetable.find({ 'slots.teacher': req.user.name });

        // Flatten the structure for frontend
        const flatSchedule = [];
        timetables.forEach(timetable => {
            timetable.slots.forEach(slot => {
                if (slot.teacher === req.user.name) {
                    flatSchedule.push({
                        id: slot._id.toString(),
                        day: timetable.day,
                        time: slot.time,
                        subject: slot.subject,
                        room: slot.room,
                        class: `${timetable.branch} - Sem ${timetable.semester}`,
                        branch: timetable.branch,
                        semester: timetable.semester
                    });
                }
            });
        });

        res.json(flatSchedule);
    } catch (error) {
        next(error);
    }
};

// @desc    Remove Timetable Slot
// @route   DELETE /api/faculty/timetable/:id
// @access  Private/Faculty
const removeTimetableSlot = async (req, res, next) => {
    try {
        const slotId = req.params.id;

        const timetable = await Timetable.findOne({ "slots._id": slotId });

        if (!timetable) {
            res.status(404);
            throw new Error('Timetable slot not found');
        }

        // Check if this teacher owns the slot
        const slot = timetable.slots.id(slotId);
        if (slot.teacher !== req.user.name) {
            res.status(401);
            throw new Error('Not authorized to delete this slot');
        }

        // Remove slot
        slot.deleteOne();
        await timetable.save();

        res.json({ message: 'Slot removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFacultyDashboard,
    getMyClasses,
    markAttendance,
    getStudentsForClass,
    updateMySubjects,
    getFacultyTimetable,
    addTimetableSlot,
    removeTimetableSlot
};
