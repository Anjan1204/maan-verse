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
app.use(cors());
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
        origin: "http://localhost:5173", // Allow client
        methods: ["GET", "POST"]
    }
});

app.set('io', io); // Make io accessible in controllers

io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

