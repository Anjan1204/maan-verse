import React, { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Search, Clock, Check, CheckCheck } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Messaging = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [showUserSearch, setShowUserSearch] = useState(false);
    const socket = useSocket();

    const fetchConversations = React.useCallback(async () => {
        try {
            const { data } = await api.get('/messaging/conversations');
            setConversations(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load chats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const fetchAllUsers = React.useCallback(async () => {
        try {
            const { data } = await api.get(`/users/search?search=${searchQuery}`);
            setAllUsers(data.filter(u => u._id !== user._id));
        } catch (error) {
            console.error(error);
        }
    }, [searchQuery, user._id]);

    useEffect(() => {
        if (!searchQuery) {
            setAllUsers([]);
            return;
        }
        const delayDebounceFn = setTimeout(() => {
            fetchAllUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, fetchAllUsers]);

    const fetchMessages = React.useCallback(async (id) => {
        try {
            const { data } = await api.get(`/messaging/conversation/${id}`);
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id);

            if (socket) {
                socket.emit('join:conversation', activeConversation._id);

                socket.on('message:received', (msg) => {
                    if (msg.conversation === activeConversation._id) {
                        setMessages(prev => {
                            // Prevent duplicate messages if already added from send response
                            if (prev.find(m => m._id === msg._id)) return prev;
                            return [...prev, msg];
                        });
                        // Update conversations list to show last message
                        fetchConversations();
                    }
                });

                return () => {
                    socket.off('message:received');
                };
            }
        }
    }, [activeConversation, socket, fetchMessages, fetchConversations]);

    // const fetchConversations moved up

    // const fetchAllUsers moved up

    // const fetchMessages moved up

    const handleStartConversation = async (participantId) => {
        try {
            const { data } = await api.post('/messaging/conversation', { participantId });
            setActiveConversation(data);
            setShowUserSearch(false);
            fetchConversations();
        } catch (error) {
            console.error(error);
            toast.error('Could not start chat');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const content = newMessage;
        setNewMessage('');
        try {
            const { data } = await api.post('/messaging/messages', {
                conversationId: activeConversation._id,
                content
            });
            // Optimization: Update UI immediately
            setMessages(prev => {
                if (prev.find(m => m._id === data._id)) return prev;
                return [...prev, data];
            });
            fetchConversations();
        } catch (error) {
            console.error(error);
            toast.error('Message failed to send');
        }
    };

    const getOtherParticipant = (participants) => {
        return participants.find(p => p._id !== user._id);
    };

    if (loading) return <div className="h-[70vh] flex items-center justify-center text-primary font-black uppercase tracking-widest text-xs animate-pulse">Syncing Encrypted Signals...</div>;

    return (
        <div className="h-[calc(100vh-160px)] flex bg-white/[0.02] rounded-[3rem] border border-white/5 overflow-hidden font-sans">
            <ToastContainer theme="dark" />

            {/* Sidebar: Chat List */}
            <div className={`w-full md:w-80 border-r border-white/5 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white tracking-tighter">Messages</h2>
                        <button
                            onClick={() => {
                                setShowUserSearch(!showUserSearch);
                                if (!showUserSearch) fetchAllUsers(); // Fetch suggested users when opening
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${showUserSearch ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                        >
                            {showUserSearch ? 'Cancel' : 'New Chat'} <MessageCircle size={16} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {showUserSearch ? (
                        <div className="p-4 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                {searchQuery ? 'Search Results' : 'Suggested People'}
                            </p>
                            {allUsers.length === 0 ? (
                                <p className="text-[10px] text-gray-600 font-bold text-center py-4 italic">No users found</p>
                            ) : (
                                allUsers.map(u => (
                                    <div
                                        key={u._id}
                                        onClick={() => handleStartConversation(u._id)}
                                        className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-all border border-transparent hover:border-white/5"
                                    >
                                        <div className="w-10 h-10 rounded-full border border-white/10 shrink-0 overflow-hidden">
                                            <img
                                                src={u.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&color=fff`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{u.name}</p>
                                            <p className="text-[9px] text-primary font-black uppercase tracking-[0.1em]">{u.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-4">
                            <div className="p-4 bg-primary/5 rounded-full text-primary/40">
                                <MessageCircle size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">No active chats</p>
                            <button
                                onClick={() => { setShowUserSearch(true); fetchAllUsers(); }}
                                className="text-[10px] font-black text-primary uppercase border-b border-primary/20 pb-0.5 hover:border-primary transition-all"
                            >
                                Start your first chat
                            </button>
                        </div>
                    ) : (
                        conversations
                            .filter(conv => {
                                const other = getOtherParticipant(conv.participants);
                                return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                            })
                            .map(conv => {
                                const other = getOtherParticipant(conv.participants);
                                const isActive = activeConversation?._id === conv._id;
                                return (
                                    <div
                                        key={conv._id}
                                        onClick={() => {
                                            setActiveConversation(conv);
                                            setShowUserSearch(false);
                                        }}
                                        className={`p-4 rounded-[1.5rem] cursor-pointer flex items-center gap-4 transition-all ${isActive ? 'bg-primary/20 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src={other?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.name || 'User')}&background=random&color=fff`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-black text-white truncate">{other?.name || 'Unknown'}</p>
                                                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate font-medium">{conv.lastMessage || 'Start a conversation...'}</p>
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            </div>

            {/* Main Chat View */}
            <div className={`flex-1 flex flex-col bg-white/[0.01] ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveConversation(null)} className="md:hidden text-gray-500 mr-2">←</button>
                                <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                                    <img
                                        src={getOtherParticipant(activeConversation.participants)?.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(getOtherParticipant(activeConversation.participants)?.name || 'User')}&background=random&color=fff`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">{getOtherParticipant(activeConversation.participants)?.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em]">Signal Online</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                            {messages.map((msg) => {
                                const isMine = msg.sender._id === user._id;
                                return (
                                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-6 py-4 rounded-[2rem] text-sm font-medium ${isMine ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                                            {msg.content}
                                            <div className={`flex items-center gap-1 mt-2 text-[8px] font-black uppercase ${isMine ? 'text-white/50' : 'text-gray-600'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMine && <CheckCheck size={10} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 flex gap-4">
                            <input
                                type="text"
                                placeholder="Secure message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                <Send size={24} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                        <div className="p-8 bg-white/[0.02] rounded-[3rem] border border-white/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center relative z-10 mx-auto">
                                <MessageCircle size={48} className="text-primary/40" />
                            </div>
                            <div className="mt-8 space-y-3 relative z-10">
                                <h3 className="text-lg font-black text-white tracking-tighter">Ready to connect?</h3>
                                <p className="text-xs text-gray-500 font-bold max-w-[240px] leading-relaxed mx-auto italic">
                                    Click the <span className="text-primary font-black uppercase">"New Chat"</span> button in the sidebar to search for students or faculty members.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-0.5 h-12 bg-gradient-to-b from-primary/20 to-transparent"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Select an Uplink to Begin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
