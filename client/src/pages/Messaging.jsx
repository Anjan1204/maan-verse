import React, { useState, useEffect } from 'react';
import { Send, User, MessageCircle, Search, Clock, Check, CheckCheck } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
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

    useEffect(() => {
        fetchConversations();
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id);
            // Polling for new messages (In a real app, use Socket.io)
            const interval = setInterval(() => fetchMessages(activeConversation._id), 3000);
            return () => clearInterval(interval);
        }
    }, [activeConversation]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/messaging/conversations');
            setConversations(data);
        } catch (error) {
            toast.error('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        if (!searchQuery) return; // Only search if query exists to save bandwidth
        try {
            const { data } = await api.get(`/users/search?search=${searchQuery}`);
            setAllUsers(data.filter(u => u._id !== user._id));
        } catch (error) { }
    };

    const fetchMessages = async (id) => {
        try {
            const { data } = await api.get(`/messaging/conversation/${id}`);
            setMessages(data);
        } catch (error) { }
    };

    const handleStartConversation = async (participantId) => {
        try {
            const { data } = await api.post('/messaging/conversation', { participantId });
            setActiveConversation(data);
            setShowUserSearch(false);
            fetchConversations();
        } catch (error) {
            toast.error('Could not start chat');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        try {
            const content = newMessage;
            setNewMessage('');
            await api.post('/messaging/messages', {
                conversationId: activeConversation._id,
                content
            });
            fetchMessages(activeConversation._id);
            fetchConversations();
        } catch (error) {
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
                            onClick={() => setShowUserSearch(!showUserSearch)}
                            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary transition-all hover:text-white"
                        >
                            <MessageCircle size={20} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                // Debounce or just call it directly for now (simple)
                                // In production use debounce
                            }}
                            onKeyUp={() => fetchAllUsers()}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {showUserSearch ? (
                        <div className="p-4 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">New Conversation</p>
                            {allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                                <div
                                    key={u._id}
                                    onClick={() => handleStartConversation(u._id)}
                                    className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 font-bold uppercase">{u.name.charAt(0)}</div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{u.name}</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{u.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const other = getOtherParticipant(conv.participants);
                            const isActive = activeConversation?._id === conv._id;
                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setActiveConversation(conv)}
                                    className={`p-4 rounded-[1.5rem] cursor-pointer flex items-center gap-4 transition-all ${isActive ? 'bg-primary/20 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/5 flex items-center justify-center shrink-0">
                                        <img src={other.profile?.avatar || `https://ui-avatars.com/api/?name=${other.name}&background=random`} alt="" className="w-full h-full rounded-full" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-black text-white truncate">{other.name}</p>
                                            <span className="text-[8px] text-gray-600 font-bold uppercase">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                                <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
                                    <img src={getOtherParticipant(activeConversation.participants).profile?.avatar || `https://ui-avatars.com/api/?name=${getOtherParticipant(activeConversation.participants).name}&background=random`} className="w-full h-full rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">{getOtherParticipant(activeConversation.participants).name}</h3>
                                    <p className="text-[9px] text-primary font-black uppercase tracking-widest">Signal Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                            {messages.map((msg, i) => {
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
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-20">
                        <div className="w-24 h-24 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
                            <MessageCircle size={48} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Select an Uplink to Begin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
