import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle, FileText, CheckCircle, ChevronRight, Lock,
    ArrowLeft, BookOpen, Clock, Award, Menu, X, Loader2,
    HelpCircle, ChevronLeft, Send, Sparkles, Download, Eye,
    Target, Lightbulb, Brain, MessageSquare, Folders, ClipboardList
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ResourceSection from '../../components/course/ResourceSection';
import AssignmentSection from '../../components/course/AssignmentSection';
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 glass rounded-[2.5rem] text-center space-y-6 border border-white/10"
            >
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    <Award size={40} />
                </div>
                <div>
                    <h2 className="text-3xl font-black mb-1">{passed ? 'Course Level Mastered!' : 'Keep Pushing Forward'}</h2>
                    <p className="text-gray-400 font-medium">Topic: <span className="text-white">{topic}</span></p>
                    <p className="text-sm text-gray-500 mt-4 font-bold uppercase tracking-widest leading-loose">
                        Your Accuracy: <span className={passed ? 'text-green-400' : 'text-red-400'}>{Math.round((score / questions.length) * 100)}%</span> <br />
                        Questions: {score}/{questions.length}
                    </p>
                </div>
                {passed && (
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-xs text-indigo-300 font-medium">
                        🎉 Progress has been synced to your academic record.
                    </div>
                )}
                <div className="pt-6">
                    <button
                        onClick={() => onComplete(score)}
                        className="px-12 py-4 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        {passed ? 'Continue Learning' : 'Try Again'}
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Module Assessment</span>
                    <h4 className="text-sm font-bold text-gray-400">Step {currentQuestion + 1} / {questions.length}</h4>
                </div>
                <div className="flex gap-1.5">
                    {questions.map((_, i) => (
                        <div key={i} className={`w-10 h-1.5 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>

            <div className="glass p-10 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <h3 className="text-2xl font-black leading-tight relative z-10">{questions[currentQuestion].q || questions[currentQuestion].question}</h3>
                <div className="grid gap-4 relative z-10">
                    {questions[currentQuestion].options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedOption(i)}
                            className={`p-6 rounded-2xl text-left font-bold transition-all border flex items-center justify-between group/option ${selectedOption === i
                                ? 'bg-primary/20 border-primary text-white shadow-xl translate-x-2'
                                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${selectedOption === i ? 'bg-primary text-white' : 'bg-white/5 text-gray-500'}`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span>{option}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === i ? 'border-primary bg-primary' : 'border-white/10 group-hover/option:border-white/30'
                                }`}>
                                {selectedOption === i && <CheckCircle size={14} className="text-white" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={selectedOption === null}
                onClick={handleNext}
                className="w-full py-6 bg-white text-black rounded-2xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
                {currentQuestion + 1 === questions.length ? 'Finalize Assessment' : 'Next Question'}
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

    const fetchData = useCallback(async () => {
        try {
            const [courseRes, enrollmentRes] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get('/enrollments/my')
            ]);

            setCourse(courseRes.data);
            const currentEnrollment = enrollmentRes.data.find(e => e.course && e.course._id === courseId);
            setEnrollment(currentEnrollment);

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
            toast.error('Failed to generate certificate');
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

                        <div className="mb-10 p-4 rounded-[1.5rem] bg-white/[0.02] border border-white/5 space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <span>Batch Progress</span>
                                <span className="text-white">{enrollment?.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${enrollment?.progress || 0}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                />
                            </div>
                            {enrollment?.progress === 100 && (
                                <button
                                    onClick={handleClaimCertificate}
                                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Award size={14} /> Claim Certificate
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

                                <div className="flex gap-2 p-2 bg-white/5 rounded-[2rem] border border-white/10 w-fit backdrop-blur-md">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500 relative ${activeTab === tab.id
                                                ? 'bg-white text-black shadow-2xl scale-105'
                                                : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            <tab.icon size={18} />
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="tabIndicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
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
                                        <div className="glass rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] aspect-video relative group bg-black">
                                            {activeChapter.videoUrl ? (
                                                <video
                                                    controls
                                                    src={activeChapter.videoUrl}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-dark to-black overflow-hidden">
                                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] animate-pulse" />
                                                    </div>
                                                    <div className="w-28 h-28 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative z-10">
                                                        <PlayCircle size={56} className="text-primary group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <h3 className="text-3xl font-black text-white relative z-10 mt-4">Encrypted Video Source</h3>
                                                    <p className="text-gray-500 text-sm mt-3 font-bold uppercase tracking-[0.2em] relative z-10">Initializing Multimedia Protocol...</p>
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
                                        <div className="p-12 glass rounded-[4rem] border border-white/10 relative overflow-hidden group bg-gradient-to-br from-white/[0.02] to-transparent">
                                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                                                <FileText size={400} />
                                            </div>

                                            <div className="relative z-10 space-y-12">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-4">
                                                        <span className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Full Study Guide</span>
                                                        <h2 className="text-5xl font-black tracking-tighter">Topic: {topic}</h2>
                                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                            <Sparkles size={14} className="text-amber-400" /> Curated for {course.category} Certification
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:flex flex-col items-end gap-2">
                                                        <div
                                                            onClick={() => activeChapter.pdfUrl && window.open(activeChapter.pdfUrl, '_blank')}
                                                            className="p-5 bg-white/5 rounded-3xl border border-white/10 shadow-2xl group/download cursor-pointer"
                                                        >
                                                            <Download size={32} className="text-white group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-600 uppercase">2.4 MB (PDF)</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                    <div className="space-y-8">
                                                        <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-primary/30 transition-colors">
                                                            <h4 className="text-lg font-black text-white flex items-center gap-3">
                                                                <div className="w-1.5 h-6 bg-primary rounded-full" />
                                                                Core Learning Verticals
                                                            </h4>
                                                            <ul className="space-y-4">
                                                                {[
                                                                    `Comprehensive analysis of ${topic} fundamentals.`,
                                                                    `Architectural integration within the ${course.category} ecosystem.`,
                                                                    `Performance benchmarking and efficiency metrics.`,
                                                                    `Enterprise-level security implementation and best practices.`
                                                                ].map((item, i) => (
                                                                    <li key={i} className="flex gap-4 group/li">
                                                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black group-hover/li:bg-primary transition-colors">{i + 1}</div>
                                                                        <p className="text-sm font-medium text-gray-400 leading-relaxed group-hover/li:text-gray-200 transition-colors">{item}</p>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div className="p-10 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/10 space-y-6">
                                                            <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                                <Brain size={20} /> Researcher Notes
                                                            </h4>
                                                            <p className="text-gray-400 leading-relaxed font-bold italic text-sm">
                                                                "This module marks a significant transition in your learning path. Ensure you have mastered the previous concepts of {course.category} before attempting the advanced practicals associated with {topic}."
                                                            </p>
                                                            <div className="h-px bg-white/5" />
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {[
                                                                    { l: 'Difficulty', v: 'High' },
                                                                    { l: 'Importance', v: 'Critical' },
                                                                    { l: 'Exam Weight', v: '25%' }
                                                                ].map(s => (
                                                                    <div key={s.l} className="flex flex-col text-center">
                                                                        <span className="text-[8px] font-black text-gray-600 uppercase mb-1">{s.l}</span>
                                                                        <span className="text-xs font-black text-white">{s.v}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <button
                                                                onClick={() => activeChapter.pdfUrl && window.open(activeChapter.pdfUrl, '_blank')}
                                                                className="flex-1 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Eye size={18} /> Review Material
                                                            </button>
                                                            <button
                                                                onClick={handleProgressUpdate}
                                                                className="px-8 py-5 bg-indigo-500/10 text-primary border border-indigo-500/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
                                                            >
                                                                Mark Reference
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
