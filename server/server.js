const express = require('express');
console.log('--- MAAN-verse SERVER CORE LOADING ---');
console.log('Process ID:', process.pid);
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('MAAN-verse API is running...');
});

// Debugging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));


// Error Handler
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Implementation of Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow client
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Make io accessible in controllers

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

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

