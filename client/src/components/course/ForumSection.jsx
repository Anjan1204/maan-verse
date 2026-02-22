import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ThumbsUp, User as UserIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ForumSection = ({ courseId }) => {
    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState({ title: '', content: '' });
    const [expandedThread, setExpandedThread] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    const fetchThreads = async () => {
        try {
            const { data } = await api.get(`/forum/course/${courseId}`);
            setThreads(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to sync discussions');
        }
    };

    useEffect(() => {
        fetchThreads();
    }, [courseId]);

    const handleCreateThread = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forum/threads', { ...newThread, courseId });
            setNewThread({ title: '', content: '' });
            fetchThreads();
            toast.success('Broadcast localized to thread history');
        } catch (error) {
            console.error(error);
            toast.error('Failed to initialize thread');
        }
    };

    const fetchComments = React.useCallback(async (threadId) => {
        try {
            const { data } = await api.get(`/forum/threads/${threadId}/comments`);
            setComments(prev => ({ ...prev, [threadId]: data }));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleAddComment = async (threadId) => {
        if (!newComment.trim()) return;
        try {
            await api.post(`/forum/threads/${threadId}/comments`, { content: newComment });
            setNewComment('');
            fetchComments(threadId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async (commentId, threadId) => {
        try {
            await api.put(`/forum/comments/${commentId}/like`);
            fetchComments(threadId);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center px-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Knowledge Exchange</span>
                    <h3 className="text-2xl font-black text-white">Discussion Repository</h3>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {threads.length} Active Threads
                </div>
            </div>

            <div className="glass p-10 md:p-14 rounded-[4rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent shadow-2xl mx-4">
                <div className="absolute right-0 top-0 p-12 opacity-[0.03] pointer-events-none">
                    <MessageSquare size={200} />
                </div>
                <div className="relative z-10 space-y-8">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-1">Initialize New Stream</span>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-4">
                            Exchange Insights
                        </h3>
                    </div>
                    <form onSubmit={handleCreateThread} className="space-y-6">
                        <input
                            type="text"
                            placeholder="Conceptual Subject Title..."
                            className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white font-bold placeholder:text-gray-700"
                            value={newThread.title}
                            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Detailed technical overview or specific query..."
                            className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white min-h-[140px] font-medium placeholder:text-gray-700"
                            value={newThread.content}
                            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                            required
                        />
                        <button type="submit" className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:scale-105 transition-all duration-500 flex items-center justify-center gap-3 shadow-3xl">
                            Commit Thread <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="space-y-6 px-4">
                {threads.length === 0 ? (
                    <div className="text-center py-32 glass rounded-[4rem] border-2 border-dashed border-white/5">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <MessageSquare size={48} className="opacity-20" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-500 italic">No historical data available</h3>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.25em] mt-4">Be the first to initialize a discussion stream</p>
                    </div>
                ) : (
                    threads.map(thread => (
                        <div key={thread._id} className="glass rounded-[3.5rem] border border-white/5 overflow-hidden transition-all duration-700 hover:border-primary/40 group/thread shadow-2xl bg-gradient-to-br from-white/[0.01] to-transparent">
                            <div
                                className="p-10 cursor-pointer relative"
                                onClick={() => {
                                    if (expandedThread === thread._id) {
                                        setExpandedThread(null);
                                    } else {
                                        setExpandedThread(thread._id);
                                        fetchComments(thread._id);
                                    }
                                }}
                            >
                                <div className="absolute right-10 top-10 opacity-10 group-hover/thread:opacity-30 transition-opacity">
                                    <MessageSquare size={40} className="text-primary" />
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary group-hover/thread:bg-primary group-hover/thread:text-white transition-all duration-500 shadow-inner">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-white group-hover/thread:text-primary transition-colors">{thread.author.name}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{new Date(thread.createdAt).toLocaleDateString()} LOCAL SIGNAL</p>
                                            </div>
                                        </div>
                                    </div>
                                    {thread.isAnnouncement && <span className="px-5 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">Strategic Broadcast</span>}
                                </div>
                                <h4 className="text-2xl font-black text-white mb-4 tracking-tighter group-hover/thread:translate-x-1 transition-transform">{thread.title}</h4>
                                <p className="text-gray-400 text-base leading-relaxed font-medium italic mb-2">"{thread.content}"</p>
                                <div className="pt-6 mt-6 border-t border-white/[0.03] flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-white/5 px-4 py-1 rounded-full group-hover/thread:bg-primary/20 group-hover/thread:text-primary transition-all">
                                        {comments[thread._id]?.length || 0} Interactions Recorded
                                    </span>
                                    <div className="text-primary group-hover/thread:translate-x-2 transition-transform">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedThread === thread._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 p-10 bg-white/[0.02]"
                                    >
                                        <div className="space-y-10">
                                            <div className="space-y-8">
                                                {comments[thread._id]?.length === 0 ? (
                                                    <p className="text-center text-gray-600 font-black uppercase tracking-widest text-[10px] py-10 italic">Awaiting secondary input signals...</p>
                                                ) : (
                                                    comments[thread._id]?.map(comment => (
                                                        <div key={comment._id} className="flex gap-6 group/comment animate-fadeIn">
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 flex-shrink-0 group-hover/comment:text-primary transition-colors">
                                                                <UserIcon size={20} />
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                                                                    <span className="text-white bg-white/5 px-3 py-1 rounded-lg">{comment.author.name}</span>
                                                                    <span className="flex items-center gap-2"><Clock size={10} /> {new Date(comment.createdAt).toLocaleTimeString()}</span>
                                                                </div>
                                                                <div className="relative group/bubble">
                                                                    <p className="text-base text-gray-300 bg-white/[0.03] p-6 rounded-[2rem] rounded-tl-none border border-white/5 font-medium leading-relaxed shadow-lg group-hover/comment:border-white/10 transition-all italic">"{comment.content}"</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleLike(comment._id, thread._id)}
                                                                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-xl scale-95 hover:scale-100 ${comment.likes.includes(window.localStorage.getItem('userId')) ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                                                                >
                                                                    <ThumbsUp size={14} /> {comment.likes.length} Validations
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-5 pt-10 border-t border-white/5">
                                                <input
                                                    type="text"
                                                    placeholder="Contribute to stream..."
                                                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 text-white font-medium transition-all"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(thread._id)}
                                                />
                                                <button
                                                    onClick={() => handleAddComment(thread._id)}
                                                    className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl"
                                                >
                                                    Transmit Signal <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ForumSection;
