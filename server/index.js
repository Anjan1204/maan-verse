const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://maan-verse.netlify.app'
].filter(origin => origin);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isNetlify = origin.endsWith('.netlify.app');
        if (allowedOrigins.includes(origin) || isNetlify || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Status Route
app.get('/api/status', async (req, res) => {
    try {
        const Course = require('./models/Course');
        const courseCount = await Course.countDocuments();
        res.json({
            status: 'online',
            environment: process.env.NODE_ENV,
            database: 'connected',
            courseCount
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/messaging', require('./routes/messageRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/payroll', require('./routes/payrollRoutes'));
app.use('/api/plagiarism', require('./routes/plagiarismRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Error Handler
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Socket logic helper
const setupSocket = (io) => {
    const loginRequests = require('./utils/loginRequests');
    io.on('connection', (socket) => {
        console.log('Client connected: ' + socket.id);
        socket.on('admin:join', () => socket.join('active-admins'));
        socket.on('login:wait', (requestId) => {
            if (loginRequests.has(requestId)) {
                const reqData = loginRequests.get(requestId);
                reqData.socketId = socket.id;
                loginRequests.set(requestId, reqData);
            }
        });
        socket.on('admin:response', ({ requestId, approved }) => {
            if (loginRequests.has(requestId)) {
                const reqData = loginRequests.get(requestId);
                const clientSocketId = reqData.socketId;
                if (clientSocketId) {
                    io.to(clientSocketId).emit('login:result', {
                        success: approved,
                        token: approved ? reqData.token : null,
                        user: approved ? reqData.user : null,
                        message: approved ? null : 'Login request rejected by admin'
                    });
                }
                loginRequests.delete(requestId);
            }
        });
        socket.on('join:conversation', (id) => socket.join(id));
        socket.on('disconnect', () => console.log('Client disconnected'));
    });
};

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        // Auto-seed if empty
        const Course = require('./models/Course');
        const count = await Course.countDocuments();
        if (count === 0) {
            console.log('Database empty, seeding sample course...');
            const User = require('./models/User');
            let admin = await User.findOne({ role: 'admin' });
            if (!admin) {
                admin = new User({ name: 'System Admin', email: 'admin@maanverse.com', password: 'password123', role: 'admin' });
                await admin.save();
            }
            await new Course({
                title: 'Introduction to MAAN-verse',
                description: 'Welcome to the platform! This is a sample course automatically generated to ensure your production environment is working.',
                category: 'General',
                faculty: admin._id,
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
                price: 0,
                isPublished: true
            }).save();
        }

        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        const io = require('socket.io')(server, {
            cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true }
        });
        app.set('io', io);
        setupSocket(io);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
