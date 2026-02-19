const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');

// @desc    Get student overall analytics
// @route   GET /api/analytics/student
// @access  Private/Student
const getStudentAnalytics = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');

        const totalCourses = enrollments.length;
        const completedCourses = enrollments.filter(e => e.progress === 100).length;

        const submissions = await Submission.find({ student: req.user._id });
        const averageGrade = submissions.length > 0
            ? submissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / submissions.length
            : 0;

        // Recently active courses
        const activeCourses = enrollments.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

        res.json({
            summary: {
                totalCourses,
                completedCourses,
                averageGrade,
                overallProgress: enrollments.reduce((acc, curr) => acc + curr.progress, 0) / (totalCourses || 1)
            },
            courseProgress: enrollments.map(e => ({
                courseId: e.course._id,
                title: e.course.title,
                progress: e.progress,
                category: e.course.category
            })),
            activeCourses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get faculty course analytics
// @route   GET /api/analytics/faculty
// @access  Private/Faculty
const getFacultyAnalytics = async (req, res, next) => {
    try {
        const courses = await Course.find({ faculty: req.user._id });
        const courseIds = courses.map(c => c._id);

        const enrollments = await Enrollment.find({ course: { $in: courseIds } });
        const submissions = await Submission.find({ assignment: { $in: await getAssignmentIds(courseIds) } });

        res.json({
            totalStudents: new Set(enrollments.map(e => e.user.toString())).size,
            totalEarnings: courses.reduce((acc, curr) => acc + (curr.price * curr.enrolledCount), 0),
            coursePerformance: courses.map(c => ({
                title: c.title,
                students: c.enrolledCount,
                averageProgress: enrollments.filter(e => e.course.toString() === c._id.toString())
                    .reduce((acc, curr) => acc + curr.progress, 0) / (c.enrolledCount || 1)
            }))
        });
    } catch (error) {
        next(error);
    }
};

// Helper to get assignment IDs for faculty courses
async function getAssignmentIds(courseIds) {
    const Assignment = require('../models/Assignment');
    const assignments = await Assignment.find({ course: { $in: courseIds } });
    return assignments.map(a => a._id);
}

module.exports = {
    getStudentAnalytics,
    getFacultyAnalytics
};
