const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const Notice = require('../models/Notice');
const Exam = require('../models/Exam');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Result = require('../models/Result');

// @desc    Get complete student dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
const getStudentDashboard = async (req, res, next) => {
    try {
        const student = await User.findById(req.user._id).select('-password');

        // 1. Stats Calculation
        // Attendance Status
        const totalAttendance = await Attendance.countDocuments({ student: req.user._id });
        const presentCount = await Attendance.countDocuments({ student: req.user._id, status: 'Present' });
        const attendancePercentage = totalAttendance === 0 ? 0 : Math.round((presentCount / totalAttendance) * 100);

        // Enrolled Courses
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate('course', 'title thumbnail category price faculty');
        const enrolledCount = enrollments.length;

        // Pending Notices
        // Assuming simple notice count for now
        const notices = await Notice.find({
            targetAudience: { $in: ['All', 'Student'] }
        }).sort({ date: -1 }).limit(5);

        // 3. Upcoming Exams (REAL DATA)
        // Fetch exams related to courses the student is enrolled in
        // Filter for active exams whose date is >= today
        // Defensive check: filter out enrollments with deleted courses
        const courseIds = enrollments.filter(e => e.course).map(e => e.course._id);

        const upcomingExams = await Exam.find({
            course: { $in: courseIds },
            isActive: true,
            'schedule.date': { $gte: new Date() } // Future exams only
        }).sort({ 'schedule.date': 1 }).limit(5);

        // Map them to a friendly format if needed, or send as is
        // The frontend expects 'exams' to be an array of schedule items usually, 
        // but 'Exam' model has a 'schedule' array. 
        // We should probably Flatten this for the dashboard "Upcoming Exams" list
        let formattedExams = [];
        upcomingExams.forEach(exam => {
            exam.schedule.forEach(sch => {
                if (new Date(sch.date) >= new Date()) {
                    formattedExams.push({
                        ...sch.toObject(),
                        examTitle: exam.title,
                        courseId: exam.course,
                        _id: exam._id
                    });
                }
            });
        });
        // Sort flattened exams
        formattedExams.sort((a, b) => new Date(a.date) - new Date(b.date));


        // 4. Results & Performance
        const results = await Result.find({ student: req.user._id }).populate('exam', 'title');

        // Calculate CGPA or Average Percentage
        let statsCGPA = 0;
        if (results.length > 0) {
            const totalObtained = results.reduce((acc, curr) => acc + curr.marksObtained, 0);
            const totalMax = results.reduce((acc, curr) => acc + curr.totalMarks, 0);
            const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
            // Convert to 10-scale CGPA roughly
            statsCGPA = (percentage / 9.5).toFixed(2);
        }

        res.json({
            profile: student,
            stats: {
                attendancePercentage,
                enrolledCount,
                cgpa: statsCGPA,
            },
            enrollments: enrollments.filter(e => e.course),
            notices,
            exams: formattedExams.slice(0, 5), // Only top 5 upcoming
            recentActivity: []
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get student timetable
// @route   GET /api/student/timetable
// @access  Private/Student
const getTimetable = async (req, res, next) => {
    try {
        const student = await User.findById(req.user._id);
        const { branch, semester } = student.studentProfile || {};
        const rawBranch = (branch || '').trim() || 'CSE';
        const rawSemester = (semester || '').trim() || '1'; // Default to '1' instead of '1st'

        // Use regex for flexible, case-insensitive matching
        const timetable = await Timetable.find({
            branch: { $regex: new RegExp(`^${rawBranch}$`, 'i') },
            semester: { $regex: new RegExp(`^${rawSemester}$`, 'i') },
            isPublished: true
        });

        res.json(timetable);
    } catch (error) {
        console.error('[TT-FETCH-ERROR]', error);
        next(error);
    }
};

// @desc    Get student attendance history
// @route   GET /api/student/attendance
// @access  Private/Student
const getAttendance = async (req, res, next) => {
    try {
        const history = await Attendance.find({ student: req.user._id }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        next(error);
    }
};

// @desc    Get student exams
// @route   GET /api/student/exams
// @access  Private/Student
const getStudentExams = async (req, res, next) => {
    try {
        // Get student's enrolled courses
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate('course', '_id');

        // Defensive check: filter out enrollments with deleted courses
        const courseIds = enrollments.filter(e => e.course).map(e => e.course._id);

        // Fetch active exams for enrolled courses
        const exams = await Exam.find({
            course: { $in: courseIds },
            isActive: true
        }).populate('course', 'title');

        // Flatten schedule array and format for frontend
        let formattedExams = [];
        exams.forEach(exam => {
            exam.schedule.forEach(sch => {
                formattedExams.push({
                    subject: sch.subject,
                    date: sch.date,
                    time: sch.time,
                    type: sch.type,
                    location: exam.title, // Using exam title as location for now
                    examTitle: exam.title,
                    courseId: exam.course?._id
                });
            });
        });

        // Sort by date
        formattedExams.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(formattedExams);
    } catch (error) {
        next(error);
    }
};

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private/Student
const getStudentResults = async (req, res, next) => {
    try {
        const results = await Result.find({ student: req.user._id })
            .populate('exam', 'title')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        // Group results by semester/exam for better organization
        // For now, return a simple structure
        const formattedResults = results.map(result => ({
            subject: result.course?.title || 'Unknown',
            grade: result.grade,
            marks: result.marksObtained,
            totalMarks: result.totalMarks,
            examTitle: result.exam?.title || 'N/A',
            feedback: result.feedback
        }));

        res.json(formattedResults);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStudentDashboard,
    getTimetable,
    getAttendance,
    getStudentExams,
    getStudentResults
};
