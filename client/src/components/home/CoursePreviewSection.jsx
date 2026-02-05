import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock } from 'lucide-react';

const CoursePreviewSection = () => {
    const courses = [
        { title: 'Full Stack Web Dev', level: 'Beginner', duration: '12 Weeks', rating: 4.8, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80' },
        { title: 'Data Science Master', level: 'Advanced', duration: '16 Weeks', rating: 4.9, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80' },
        { title: 'UI/UX Design', level: 'Intermediate', duration: '8 Weeks', rating: 4.7, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80' },
    ];

    return (
        <div className="py-24 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Popular Courses</h2>
                        <p className="text-gray-400">Top-rated by students worldwide</p>
                    </div>
                    <Link to="/courses" className="text-primary font-bold flex items-center gap-2 hover:bg-gray-900 px-4 py-2 rounded-lg transition-colors">
                        View All Courses <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses.map((course, i) => (
                        <div key={i} className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star size={12} className="text-yellow-400 fill-current" /> {course.rating}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{course.level}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{course.title}</h3>
                                <Link to="/courses" className="block w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-center">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoursePreviewSection;
