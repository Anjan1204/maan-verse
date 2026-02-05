const Course = require('../models/Course');

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const courses = await Course.find({ ...keyword, ...category, isPublished: true }).populate('faculty', 'name');

        res.json(courses);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('faculty', 'name');

        if (course) {
            res.json(course);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Faculty/Admin
const createCourse = async (req, res, next) => {
    try {
        const { title, price, description, thumbnail, category, isPublished } = req.body;

        const course = new Course({
            title: title || 'Untitled Course',
            price: price || 0,
            faculty: req.user._id,
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            category: category || 'General',
            description: description || 'No description provided',
            isPublished: isPublished !== undefined ? isPublished : false,
            chapters: [
                {
                    title: 'Introduction to ' + (title || 'Subject'),
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video
                    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Sample PDF
                    isFree: true
                },
                {
                    title: 'Core Fundamentals',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    isFree: false
                },
                {
                    title: 'Advanced Implementation',
                    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    isFree: false
                }
            ]
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Faculty/Admin
const updateCourse = async (req, res, next) => {
    try {
        const {
            title,
            price,
            description,
            thumbnail,
            category,
            isPublished,
            chapters,
        } = req.body;

        const course = await Course.findById(req.params.id);

        if (course) {
            // Check ownership
            if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error('Not authorized to update this course');
            }

            course.title = title !== undefined ? title : course.title;
            course.price = price !== undefined ? price : course.price;
            course.description = description !== undefined ? description : course.description;
            course.thumbnail = thumbnail !== undefined ? thumbnail : course.thumbnail;
            course.category = category !== undefined ? category : course.category;
            course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;
            course.chapters = chapters !== undefined ? chapters : course.chapters;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Faculty/Admin
const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check ownership
            if (course.faculty.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                res.status(401);
                throw new Error('Not authorized to delete this course');
            }

            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch all courses for admin (including unpublished)
// @route   GET /api/courses/admin/all
// @access  Private/Admin
const getAllCoursesAdmin = async (req, res, next) => {
    try {
        console.log('--- ADMIN FETCH ALL COURSES REQUEST ---');
        console.log('Keyword:', req.query.keyword);

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        console.log('Query:', { ...keyword, ...category });

        // Admin sees ALL courses, not just published ones
        const courses = await Course.find({ ...keyword, ...category }).populate('faculty', 'name');

        console.log(`Found ${courses.length} courses`);
        res.json(courses);
    } catch (error) {
        console.error('Error in getAllCoursesAdmin:', error);
        next(error);
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCoursesAdmin,
};
