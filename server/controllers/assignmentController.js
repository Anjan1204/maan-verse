const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private/Faculty
const createAssignment = async (req, res, next) => {
    try {
        const { title, description, courseId, dueDate, totalPoints } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Verify faculty owns the course or has rights
        if (course.faculty.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to add assignments to this course');
        }

        const assignment = await Assignment.create({
            title,
            description,
            course: courseId,
            faculty: req.user._id,
            dueDate,
            totalPoints
        });

        res.status(201).json(assignment);
    } catch (error) {
        next(error);
    }
};

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getCourseAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId }).populate('faculty', 'name');
        res.json(assignments);
    } catch (error) {
        next(error);
    }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res, next) => {
    try {
        const { fileUrl, content } = req.body;
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            res.status(404);
            throw new Error('Assignment not found');
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id
        });

        if (existingSubmission) {
            res.status(400);
            throw new Error('You have already submitted this assignment');
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            fileUrl,
            content,
            status: new Date() > assignment.dueDate ? 'Late' : 'Submitted'
        });

        res.status(201).json(submission);
    } catch (error) {
        next(error);
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Faculty
const getAssignmentSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email');
        res.json(submissions);
    } catch (error) {
        next(error);
    }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private/Faculty
const gradeSubmission = async (req, res, next) => {
    try {
        const { grade, feedback } = req.body;
        const submission = await Submission.findById(req.params.submissionId);

        if (!submission) {
            res.status(404);
            throw new Error('Submission not found');
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'Graded';

        await submission.save();
        res.json(submission);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAssignment,
    getCourseAssignments,
    submitAssignment,
    getAssignmentSubmissions,
    gradeSubmission
};
