const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private/Student
const enrollInCourse = async (req, res, next) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        const existingEnrollment = await Enrollment.findOne({
            student: req.user._id,
            course: courseId,
        });

        if (existingEnrollment) {
            res.status(400);
            throw new Error('Already enrolled');
        }

        const createdEnrollment = await Enrollment.create({
            student: req.user._id,
            course: courseId,
        });

        // Update Course enrollment count
        course.enrolledCount = (course.enrolledCount || 0) + 1;
        await course.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('enrollment:new', { courseId: course._id, studentId: req.user._id });
            io.emit('revenue:update', { amount: course.price });
        }

        res.status(201).json(createdEnrollment);
    } catch (error) {
        next(error);
    }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my
// @access  Private/Student
const getMyEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
        res.json(enrollments.filter(e => e.course));
    } catch (error) {
        next(error);
    }
};

const User = require('../models/User');

// @desc    Update progress for an enrollment
// @route   PUT /api/enrollments/progress
// @access  Private/Student
const updateProgress = async (req, res, next) => {
    try {
        const { courseId, chapterId } = req.body;

        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: courseId,
        }).populate('course');

        if (!enrollment) {
            res.status(404);
            throw new Error('Enrollment not found');
        }

        // Add chapter to completed list if not already there
        if (!enrollment.completedChapters.includes(chapterId)) {
            enrollment.completedChapters.push(chapterId);

            // Award Points: 100 per normal chapter
            enrollment.coursePoints = (enrollment.coursePoints || 0) + 100;

            // Update Global User Points
            const user = await User.findById(req.user._id);
            if (user) {
                user.lifetimePoints = (user.lifetimePoints || 0) + 100;
                await user.save();
            }

            // Calculate percentage
            const totalChapters = enrollment.course.chapters?.length || 1;
            const completedCount = enrollment.completedChapters.length;
            enrollment.progress = Math.min(100, Math.round((completedCount / totalChapters) * 100));

            if (enrollment.progress === 100) {
                enrollment.isCompleted = true;
                // Bonus for course completion
                enrollment.coursePoints += 500;
                if (user) {
                    user.lifetimePoints += 500;
                    await user.save();
                }
            }

            await enrollment.save();
        }

        res.json(enrollment);
    } catch (error) {
        next(error);
    }
};

// @desc    Get enrollments for a course
// @route   GET /api/enrollments/course/:id
// @access  Private/Faculty/Admin
const getCourseEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ course: req.params.id }).populate('student', 'name email');
        res.json(enrollments);
    } catch (error) {
        next(error);
    }
};

module.exports = { enrollInCourse, getMyEnrollments, getCourseEnrollments, updateProgress };
