const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithLink = async (req, res) => {
    try {
        const { message, history } = req.body;

        // Check if API key exists
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API Key not configured" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Convert history to Gemini format if needed, or just send prompt
        // Simple implementation first: Just send the message with context
        const chat = model.startChat({
            history: history ? history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            })) : [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: "AI Service Unavailable", error: error.message });
    }
};

module.exports = { chatWithLink };
