import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle, FileText, CheckCircle, ChevronRight, Lock,
    ArrowLeft, BookOpen, Clock, Award, Menu, X, Loader2,
    HelpCircle, ChevronLeft, Send, Sparkles, Download, Eye,
    Target, Lightbulb, Brain, MessageSquare, Folders, ClipboardList,
    Maximize2, Volume2, ShieldCheck, Zap
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ResourceSection from '../../components/course/ResourceSection';
import AssignmentSection from '../../components/course/AssignmentSection';
import ForumSection from '../../components/course/ForumSection';
import { generateCertificate } from '../../utils/certificateGenerator';
import AITutor from '../../components/AITutor';

const QuizComponent = ({ topic, topicQuestions, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const questions = topicQuestions || [];

    const handleNext = () => {
        if (selectedOption === (questions[currentQuestion].correctAnswer ?? questions[currentQuestion].correct)) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            setShowResult(true);
        }
    };

    if (showResult) {
        const passed = score >= questions.length * 0.6;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 md:p-20 glass rounded-[4rem] text-center space-y-10 border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl max-w-4xl mx-auto"
            >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Award size={300} />
                </div>
                <div className={`w-32 h-32 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-inner ${passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                    <Award size={64} className={passed ? 'animate-pulse' : ''} />
                </div>
                <div className="space-y-4 relative z-10">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Academic Evaluation Complete</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{passed ? 'Course Level Mastered' : 'Iteration Required'}</h2>
                    <p className="text-gray-400 font-bold text-lg">Focus Area: <span className="text-white italic underline decoration-primary underline-offset-8">{topic}</span></p>

                    <div className="grid grid-cols-2 gap-8 pt-8 max-w-md mx-auto">
                        <div className="flex flex-col gap-1 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Accuracy Rate</span>
                            <span className={`text-3xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>{Math.round((score / questions.length) * 100)}%</span>
                        </div>
                        <div className="flex flex-col gap-1 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest leading-none">Task Completion</span>
                            <span className="text-3xl font-black text-white">{score}/{questions.length}</span>
                        </div>
                    </div>
                </div>
                {passed && (
                    <div className="bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-500/10 text-xs text-emerald-400 font-black uppercase tracking-[0.2em] max-w-lg mx-auto relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                            <Sparkles size={48} />
                        </div>
                        🎉 Progress Synchronized to Institutional Records
                    </div>
                )}
                <div className="pt-8 relative z-10">
                    <button
                        onClick={() => onComplete(score)}
                        className={`px-16 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-3xl transition-all duration-500 flex items-center justify-center gap-4 mx-auto hover:scale-105 active:scale-95 ${passed ? 'bg-white text-black hover:bg-primary hover:text-white' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                    >
                        {passed ? 'Resume Academic Track' : 'Restart Simulation'}
                        {passed ? <ChevronRight size={18} /> : <Zap size={18} />}
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-12 max-w-3xl mx-auto pb-24">
            <div className="flex justify-between items-end px-6">
                <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Technical Assessment</span>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter">Strategic Validation</h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Protocol Progress</span>
                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-700 ${i <= currentQuestion ? 'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-[4rem] border border-white/10 space-y-12 relative overflow-hidden group bg-gradient-to-br from-white/[0.01] to-transparent shadow-2xl">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-px bg-primary/40" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Direct Query {currentQuestion + 1}</span>
                    </div>
                    <h3 className="text-3xl font-black leading-tight text-white tracking-tight italic">"{questions[currentQuestion].q || questions[currentQuestion].question}"</h3>
                </div>

                <div className="grid gap-5 relative z-10">
                    {questions[currentQuestion].options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedOption(i)}
                            className={`p-7 rounded-[2rem] text-left font-bold transition-all duration-500 border-2 flex items-center justify-between group/option relative overflow-hidden ${selectedOption === i
                                ? 'bg-primary/20 border-primary text-white shadow-2xl -translate-y-1'
                                : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-0.5'
                                }`}
                        >
                            <div className="flex items-center gap-5">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${selectedOption === i ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-600 group-hover/option:text-gray-400'}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className="text-lg tracking-tight">{option}</span>
                            </div>
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${selectedOption === i ? 'border-primary bg-primary scale-110' : 'border-white/10 group-hover/option:border-white/30'
                                }`}>
                                {selectedOption === i && <CheckCircle size={16} className="text-white" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={selectedOption === null}
                onClick={handleNext}
                className="w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.35em] disabled:opacity-20 disabled:grayscale transition-all duration-700 shadow-3xl hover:bg-primary hover:text-white hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
                {currentQuestion + 1 === questions.length ? 'Secure Terminal Signals' : 'Advance Assessment'}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

const CourseContentPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);
    const [activeTab, setActiveTab] = useState('video');
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userPoints, setUserPoints] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const [courseRes, enrollmentRes, userRes] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get('/enrollments/my'),
                api.get('/users/profile')
            ]);

            setCourse(courseRes.data);
            const currentEnrollment = enrollmentRes.data.find(e => e.course && e.course._id === courseId);
            setEnrollment(currentEnrollment);
            setUserPoints(userRes.data.lifetimePoints || 0);

            if (courseRes.data.chapters && courseRes.data.chapters.length > 0) {
                setActiveChapter(courseRes.data.chapters[0]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load course content');
            navigate('/student/dashboard');
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        fetchData();
    }, [courseId, navigate, fetchData]);

    const handleProgressUpdate = async () => {
        if (!activeChapter || !courseId) return;

        try {
            const { data } = await api.put('/enrollments/progress', {
                courseId,
                chapterId: activeChapter._id
            });
            setEnrollment(data);
            toast.success('Chapter completion recorded!');
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleClaimCertificate = async () => {
        if (!enrollment || enrollment.progress < 100) return;

        try {
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
            const certificateId = `CRT-${courseId.slice(-6)}-${user._id.slice(-6)}`.toUpperCase();

            await generateCertificate(user.name, course.title, date, certificateId);
            toast.success('Certificate generated successfully!');
        } catch (error) {
            console.error(error);
            toast.error("Download blocked. Ensure your progress is tracked.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Restoring Your Session...</p>
                </div>
            </div>
        );
    }

    if (!course) return null;

    const tabs = [
        { id: 'video', label: 'Watch Lesson', icon: PlayCircle },
        { id: 'material', label: 'Study Material', icon: FileText },
        { id: 'quiz', label: 'Interactive Quiz', icon: HelpCircle },
        { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
        { id: 'resources', label: 'Extra Resources', icon: Folders },
        { id: 'assignments', label: 'Assignments', icon: ClipboardList },
        { id: 'ai-tutor', label: 'AI Tutor', icon: Sparkles },
    ];

    const topic = activeChapter?.title || '';

    return (
        <div className="min-h-screen bg-dark flex flex-col md:flex-row text-white overflow-hidden">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-6 left-4 z-50 p-3 bg-primary rounded-xl shadow-2xl shadow-primary/30"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed md:relative inset-y-0 left-0 w-80 bg-surface border-r border-white/5 z-40 p-6 flex flex-col pt-20 md:pt-6"
                    >
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-xs font-black uppercase tracking-widest group px-2"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            To Dashboard
                        </button>

                        <div className="mb-8 px-2">
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Premium Content</span>
                            <h2 className="text-xl font-black line-clamp-2 leading-tight tracking-tight">{course.title}</h2>
                        </div>

                        <div className="mb-10 p-5 rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-5 shadow-xl">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-secondary" /> Learning Progress</span>
                                    <span className="text-white bg-secondary/20 px-2 py-0.5 rounded-full">{enrollment?.progress || 0}%</span>
                                </div>
                                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${enrollment?.progress || 0}%` }}
                                        className="h-full rounded-full bg-gradient-to-r from-primary via-indigo-400 to-secondary shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                        <Zap size={10} className="text-amber-400" /> Course XP
                                    </span>
                                    <span className="text-lg font-black text-white">{enrollment?.coursePoints || 0}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles size={10} className="text-primary" /> Total XP
                                    </span>
                                    <span className="text-lg font-black text-white">{userPoints}</span>
                                </div>
                            </div>

                            {enrollment?.progress === 100 && (
                                <button
                                    onClick={handleClaimCertificate}
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group/cert"
                                >
                                    <Award size={14} className="group-hover:rotate-12 transition-transform" /> Claim Your Credentials
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                            {course.chapters?.map((chapter, index) => {
                                const isCompleted = enrollment?.completedChapters?.includes(chapter._id);
                                return (
                                    <button
                                        key={chapter._id}
                                        onClick={() => {
                                            setActiveChapter(chapter);
                                            setActiveTab('video');
                                        }}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border group/btn ${activeChapter?._id === chapter._id
                                            ? 'bg-primary/10 border-primary/30 text-white'
                                            : 'bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05] hover:border-white/10 hover:text-gray-300'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg transition-colors ${activeChapter?._id === chapter._id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-600 group-hover/btn:text-gray-400'
                                            }`}>
                                            {chapter.videoUrl ? <PlayCircle size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-0.5">Lesson {index + 1}</p>
                                            <p className="text-xs font-bold truncate leading-snug">{chapter.title}</p>
                                        </div>
                                        {isCompleted && <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar bg-dark">
                <div className="max-w-6xl mx-auto w-full p-6 md:p-12 space-y-12">
                    {activeChapter ? (
                        <>
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-secondary">
                                            {course.category}
                                        </span>
                                        <div className="h-1 w-1 bg-gray-700 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            {course.faculty?.name || 'Academic Faculty'}
                                        </span>
                                    </div>
                                    <h1 className="text-5xl font-black tracking-tighter leading-[0.9] text-white underline decoration-primary/30 underline-offset-8 decoration-4">{activeChapter.title}</h1>
                                    <div className="flex flex-wrap items-center gap-8 pt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-primary border border-indigo-500/20"><Clock size={16} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-500 uppercase">Duration</span>
                                                <span className="text-sm font-bold">45 Minutes</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20"><Target size={16} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-500 uppercase">Difficulty</span>
                                                <span className="text-sm font-bold capitalize">{course.level || 'Professional'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20"><Brain size={16} /></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-500 uppercase">Assessment</span>
                                                <span className="text-sm font-bold">Required</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 p-2 bg-white/[0.03] rounded-[2.5rem] border border-white/10 w-fit backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar max-w-full">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap group/tab ${activeTab === tab.id
                                                ? 'bg-white text-black shadow-2xl scale-105 z-10'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            <tab.icon size={18} className={`${activeTab === tab.id ? 'text-primary' : 'group-hover/tab:text-primary'} transition-colors`} />
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="tabIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                key={`${activeChapter._id}-${activeTab}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="min-h-[600px]"
                            >
                                {activeTab === 'video' && (
                                    <div className="space-y-10">
                                        <div className="glass rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] aspect-video relative group bg-black group/player">
                                            {activeChapter.videoUrl ? (
                                                <div className="relative w-full h-full">
                                                    <video
                                                        controls
                                                        src={activeChapter.videoUrl}
                                                        className="w-full h-full object-contain"
                                                        poster={course.thumbnail}
                                                    />
                                                    <div className="absolute inset-0 pointer-events-none border-[10px] border-black/10 rounded-[3rem] md:rounded-[5rem]" />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 via-dark to-black overflow-hidden relative">
                                                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] animate-pulse" />
                                                        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary rounded-full blur-[100px] opacity-40 animate-bounce" style={{ animationDuration: '10s' }} />
                                                    </div>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex flex-col items-center relative z-10"
                                                    >
                                                        <div className="w-32 h-32 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl backdrop-blur-sm group-hover/player:border-primary/40 transition-all duration-700">
                                                            <PlayCircle size={64} className="text-primary group-hover/player:scale-110 group-hover/player:text-white transition-all duration-500" />
                                                        </div>
                                                        <h3 className="text-4xl font-black text-white tracking-tighter">Lesson Offline</h3>
                                                        <p className="text-gray-500 text-xs mt-4 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                            <Zap size={14} className="text-amber-500" /> Waiting for Stream Signal
                                                        </p>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 p-10 glass rounded-[3rem] border border-white/5 flex gap-8">
                                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                                    <Lightbulb size={32} />
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-2xl font-black tracking-tight">Executive Summary</h3>
                                                    <p className="text-gray-400 leading-relaxed text-lg font-medium italic">
                                                        "Explore the intricate details of {topic}. This core module focuses on scalability metrics, security protocols, and strategic implementation that are critical for modern high-performance systems."
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-10 glass rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                                    <BookOpen size={24} />
                                                </div>
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-500">Related Path</p>
                                                <h4 className="font-bold text-white">Cloud Architecture</h4>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'material' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                                        <div className="p-8 md:p-14 glass rounded-[3rem] md:rounded-[6rem] border border-white/10 relative overflow-hidden group/material bg-gradient-to-br from-white/[0.04] to-transparent shadow-3xl">
                                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover/material:rotate-6 group-hover/material:scale-110 transition-all duration-1000">
                                                <FileText size={500} />
                                            </div>

                                            <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

                                            <div className="relative z-10 space-y-16">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                                    <div className="space-y-6 max-w-2xl">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-5 py-2 bg-primary/20 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">Mastery Resource</span>
                                                            <div className="h-1.5 w-1.5 bg-white/20 rounded-full" />
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Version 2026.4.1</span>
                                                        </div>
                                                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white italic">{topic}</h2>
                                                        <p className="text-gray-400 font-bold uppercase tracking-[0.15em] text-xs flex items-center gap-3">
                                                            <Sparkles size={16} className="text-amber-400 animate-pulse" /> Certified Study Protocol
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-center md:items-end gap-3 p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-md">
                                                        <button
                                                            onClick={() => activeChapter.pdfUrl && window.open(activeChapter.pdfUrl, '_blank')}
                                                            className="p-6 bg-white text-black rounded-[2rem] shadow-2xl hover:bg-primary hover:text-white hover:scale-110 transition-all duration-500"
                                                        >
                                                            <Download size={32} />
                                                        </button>
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Secure PDF Download</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                                    <div className="space-y-10">
                                                        <div className="p-10 bg-white/[0.01] rounded-[3.5rem] border border-white/5 space-y-8 hover:border-primary/20 transition-all duration-700">
                                                            <h4 className="text-xl font-black text-white flex items-center gap-4">
                                                                <div className="w-2 h-8 bg-gradient-to-b from-primary to-transparent rounded-full" />
                                                                Knowledge Framework
                                                            </h4>
                                                            <div className="space-y-6">
                                                                {[
                                                                    { t: "Conceptual Depth", d: `In-depth investigation of ${topic} core architecture.` },
                                                                    { t: "Ecosystem Alignment", d: `Strategic integration within the wider ${course.category} landscape.` },
                                                                    { t: "Performance Auditing", d: "Advanced benchmarking techniques for peak efficiency." },
                                                                    { t: "High-Tier Security", d: "Professional grade security enforcement protocols." }
                                                                ].map((item, i) => (
                                                                    <div key={i} className="flex gap-6 group/item">
                                                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-gray-500 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500 border border-white/5 shadow-inner">
                                                                            0{i + 1}
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <p className="text-sm font-black text-white tracking-tight">{item.t}</p>
                                                                            <p className="text-xs font-medium text-gray-500 leading-relaxed group-hover/item:text-gray-400 transition-colors">{item.d}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-10">
                                                        <div className="p-10 bg-indigo-500/[0.02] rounded-[3.5rem] border border-indigo-500/10 space-y-8 relative group/notes shadow-inner overflow-hidden">
                                                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px]" />
                                                            <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                                                <Brain size={22} className="animate-pulse" /> Faculty Insights
                                                            </h4>
                                                            <p className="text-gray-300 leading-relaxed font-bold italic text-base relative z-10">
                                                                "This material serves as the definitive guide for {topic}. Pay close attention to the intersection of scalability and efficiency mentioned on page 14."
                                                            </p>
                                                            <div className="h-px bg-white/5 relative z-10" />
                                                            <div className="flex justify-between relative z-10">
                                                                {[
                                                                    { l: 'Intensity', v: 'Extreme' },
                                                                    { l: 'Priority', v: 'Max' },
                                                                    { l: 'Complexity', v: 'High' }
                                                                ].map(s => (
                                                                    <div key={s.l} className="flex flex-col">
                                                                        <span className="text-[9px] font-black text-gray-600 uppercase mb-1">{s.l}</span>
                                                                        <span className="text-xs font-black text-white bg-white/5 px-3 py-1 rounded-lg">{s.v}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-5">
                                                            <button
                                                                onClick={() => activeChapter.pdfUrl && window.open(activeChapter.pdfUrl, '_blank')}
                                                                className="flex-1 py-6 bg-white text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:scale-[1.05] transition-all duration-500 shadow-3xl disabled:opacity-30 disabled:pointer-events-none"
                                                                disabled={!activeChapter.pdfUrl}
                                                            >
                                                                <Eye size={20} className="inline mr-2" /> Open Lecture Notes
                                                            </button>
                                                            <button
                                                                onClick={handleProgressUpdate}
                                                                className="flex-1 py-6 bg-primary/10 text-primary border border-primary/20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-500"
                                                            >
                                                                Mark As Studied
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'quiz' && (
                                    <QuizComponent
                                        topic={activeChapter.title}
                                        category={course.category}
                                        topicQuestions={activeChapter.quiz}
                                        onComplete={handleProgressUpdate}
                                    />
                                )}

                                {activeTab === 'forum' && (
                                    <ForumSection courseId={courseId} />
                                )}

                                {activeTab === 'resources' && (
                                    <ResourceSection resources={course.resources} />
                                )}

                                {activeTab === 'assignments' && (
                                    <AssignmentSection courseId={courseId} />
                                )}

                                {activeTab === 'ai-tutor' && (
                                    <AITutor courseTitle={course.title} />
                                )}
                            </motion.div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
                            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-10 animate-floating">
                                <BookOpen size={48} className="text-gray-700" />
                            </div>
                            <h2 className="text-3xl font-black text-white">Archive Ready</h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Select a lesson to begin synchronization</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CourseContentPage;
