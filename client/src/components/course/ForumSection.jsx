import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ThumbsUp, User as UserIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ForumSection = ({ courseId }) => {
    const [threads, setThreads] = useState([]);
    // const [loading, setLoading] = useState(true); // Removed unused variable 'loading'
    const [newThread, setNewThread] = useState({ title: '', content: '' });
    const [expandedThread, setExpandedThread] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    // Define fetchThreads outside useEffect so it can be called by handleCreateThread
    const fetchThreads = async () => {
        try {
            const { data } = await api.get(`/forum/course/${courseId}`);
            setThreads(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load discussions'); // Updated message
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchThreads();
    }, [courseId]); // Dependency changed to courseId

    const handleCreateThread = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forum/threads', { ...newThread, courseId });
            setNewThread({ title: '', content: '' });
            fetchThreads();
            toast.success('Discussion started!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create thread');
        }
    };

    const fetchComments = React.useCallback(async (threadId) => {
        try {
            const { data } = await api.get(`/forum/threads/${threadId}/comments`);
            setComments(prev => ({ ...prev, [threadId]: data }));
        } catch (error) {
            console.error(error);
            toast.error('Failed to load comments');
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
            toast.error('Failed to add comment');
        }
    };

    const handleLike = async (commentId, threadId) => {
        try {
            await api.put(`/forum/comments/${commentId}/like`);
            fetchComments(threadId);
        } catch (error) {
            console.error(error);
            toast.error('Failed to like comment');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <h3 className="text-xl font-black flex items-center gap-3">
                    <MessageSquare className="text-primary" /> Start a Discussion
                </h3>
                <form onSubmit={handleCreateThread} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Thread Title"
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white font-bold"
                        value={newThread.title}
                        onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="What's on your mind? Share your thoughts or questions about the course..."
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-white min-h-[120px]"
                        value={newThread.content}
                        onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                        required
                    />
                    <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-black hover:scale-105 transition-all flex items-center gap-2">
                        Post Thread <Send size={16} />
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {threads.map(thread => (
                    <div key={thread._id} className="glass rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-white/10">
                        <div
                            className="p-6 cursor-pointer"
                            onClick={() => {
                                if (expandedThread === thread._id) {
                                    setExpandedThread(null);
                                } else {
                                    setExpandedThread(thread._id);
                                    fetchComments(thread._id);
                                }
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                        <UserIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{thread.author.name}</p>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(thread.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {thread.isAnnouncement && <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">Announcement</span>}
                            </div>
                            <h4 className="text-lg font-black text-white mb-2">{thread.title}</h4>
                            <p className="text-gray-400 text-sm line-clamp-2">{thread.content}</p>
                        </div>

                        <AnimatePresence>
                            {expandedThread === thread._id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5 p-6 bg-white/[0.01]"
                                >
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            {comments[thread._id]?.map(comment => (
                                                <div key={comment._id} className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 flex-shrink-0">
                                                        <UserIcon size={16} />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            <span>{comment.author.name}</span>
                                                            <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-300 bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">{comment.content}</p>
                                                        <button
                                                            onClick={() => handleLike(comment._id, thread._id)}
                                                            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${comment.likes.includes(window.localStorage.getItem('userId')) ? 'text-primary' : 'text-gray-600 hover:text-white'}`}
                                                        >
                                                            <ThumbsUp size={12} /> {comment.likes.length} Likes
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/30"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(thread._id)}
                                            />
                                            <button
                                                onClick={() => handleAddComment(thread._id)}
                                                className="p-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumSection;
