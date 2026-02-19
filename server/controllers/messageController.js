const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Create or get conversation
// @route   POST /api/messaging/conversation
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
    try {
        const { participantId } = req.body;

        // Find existing conversation between these two
        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, participantId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, participantId]
            });
        }

        res.json(conversation);
    } catch (error) {
        next(error);
    }
};

// @desc    Send message
// @route   POST /api/messaging/messages
// @access  Private
const sendMessage = async (req, res, next) => {
    try {
        const { conversationId, content } = req.body;

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            content
        });

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content
        });

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

// @desc    Get conversation messages
// @route   GET /api/messaging/conversation/:id
// @access  Private
const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ conversation: req.params.id })
            .populate('sender', 'name profile.avatar')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's active conversations
// @route   GET /api/messaging/conversations
// @access  Private
const getMyConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] }
        }).populate('participants', 'name profile.avatar role')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrCreateConversation,
    sendMessage,
    getMessages,
    getMyConversations
};
