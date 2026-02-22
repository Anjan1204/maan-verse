const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration for production
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://maan-verse.netlify.app' // Explicit production origin
].filter(origin => origin); // Remove undefined/null

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

// Proactive Fix: Auto-seed 1 sample course if database is empty
const autoSeed = async () => {
    try {
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
            console.log('Sample course seeded successfully.');
        }
    } catch (error) {
        console.error('Auto-seed failed:', error);
    }
};
autoSeed();

app.use(helmet({
    crossOriginResourcePolicy: false, // For local image serving
}));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Socket.io configuration
const io = require('socket.io')(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set('io', io);

const loginRequests = require('./utils/loginRequests');

io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    // Admin Joining the Active Room
    socket.on('admin:join', () => {
        console.log(`Socket ${socket.id} joined active-admins`);
        socket.join('active-admins');
    });

    // Client waiting for approval connects their socket to the request
    socket.on('login:wait', (requestId) => {
        if (loginRequests.has(requestId)) {
            const reqData = loginRequests.get(requestId);
            reqData.socketId = socket.id;
            loginRequests.set(requestId, reqData);
            console.log(`Socket ${socket.id} linked to request ${requestId}`);
        }
    });

    // Admin responding to a request
    socket.on('admin:response', ({ requestId, approved, adminName }) => {
        console.log(`Admin response for ${requestId}: ${approved ? 'Approved' : 'Rejected'}`);

        if (loginRequests.has(requestId)) {
            const reqData = loginRequests.get(requestId);
            const clientSocketId = reqData.socketId;

            if (clientSocketId) {
                if (approved) {
                    // Send success to the waiting user
                    io.to(clientSocketId).emit('login:result', {
                        success: true,
                        token: reqData.token, // Send the stored token
                        user: reqData.user
                    });
                } else {
                    // Send rejection
                    io.to(clientSocketId).emit('login:result', {
                        success: false,
                        message: 'Login request rejected by admin'
                    });
                }
            }

            // Cleanup
            loginRequests.delete(requestId);
        }
    });

    // Messaging: User joins a specific conversation room
    socket.on('join:conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
