import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen } from 'lucide-react';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || searchParams.get('category') || '');
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = searchParams.get('search') || searchParams.get('category') || '';
        setSearchTerm(query);
    }, [searchParams]);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const coursesRes = await api.get('/courses');
                if (Array.isArray(coursesRes.data)) {
                    setCourses(coursesRes.data);
                } else {
                    console.error('Courses data is not an array:', coursesRes.data);
                    setError('Received invalid data format from server');
                }

                if (user && user.role === 'student') {
                    try {
                        const enrollRes = await api.get('/enrollments/my');
                        setMyEnrollments(enrollRes.data.map(e => e.course?._id).filter(id => id));
                    } catch (err) {
                        console.warn('Enrollment check failed:', err.message);
                        // Don't set global error for this, just continue
                    }
                }
            } catch (err) {
                console.error('FETCH ERROR:', err.message);
                setError(err.message === 'Network Error'
                    ? `Cannot connect to server at ${api.defaults.baseURL}. Please check if the backend is running and CORS is allowed.`
                    : `Error loading courses: ${err.message}`);

                if (err.response) {
                    console.error('Response Error:', err.response.status, err.response.data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleEnroll = async (courseId) => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/purchase/${courseId}`);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-dark">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-2">Explore Courses</h2>
                        <p className="text-gray-400">Discover new skills and master your passion</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary w-full md:w-64"
                            />
                        </div>
                        {/* <button className="p-2 bg-surface border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500">
                            <Filter size={20} />
                        </button> */}
                    </div>
                </div>

                {error && (
                    <div className="mb-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                        <h3 className="text-xl font-bold mb-2">Connection Issue Detected</h3>
                        <p className="mb-4">{error}</p>
                        <div className="text-xs bg-black/30 p-4 rounded-xl font-mono break-all opacity-70">
                            DEBUG INFO:<br />
                            API Base: {api.defaults.baseURL}<br />
                            Environment: {import.meta.env.MODE}<br />
                            VITE_API_URL: {import.meta.env.VITE_API_URL || 'NOT SET'}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course, index) => {
                        const isEnrolled = myEnrollments.includes(course._id);
                        return (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                        {course.category}
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1" title={course.title}>{course.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{course.description}</p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                                                {course.faculty?.name?.[0] || 'F'}
                                            </div>
                                            <span>{course.faculty?.name || 'Instructor'}</span>
                                        </div>
                                        <span className="text-lg font-bold text-secondary">₹{course.price}</span>
                                    </div>

                                    <button
                                        onClick={() => handleEnroll(course._id)}
                                        disabled={isEnrolled}
                                        className={`mt-6 w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                            ${isEnrolled
                                                ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/20'
                                                : 'bg-primary hover:bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/25'
                                            }`}
                                    >
                                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredCourses.length === 0 && !error && (
                    <div className="text-center py-20 text-gray-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-xl">No courses found matching your criteria</p>
                        <div className="mt-8 text-xs font-mono opacity-30">
                            Check: {api.defaults.baseURL}/courses
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
