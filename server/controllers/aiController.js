const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithLink = async (req, res) => {
    try {
        const { message, history } = req.body;

        console.log(`[AI-CHAT] Request received from user ${req.user?._id}`);

        // Check if API key exists
        if (!process.env.GEMINI_API_KEY) {
            console.error("[AI-CHAT] GEMINI_API_KEY is missing in environment");
            return res.status(500).json({ message: "Gemini API Key not configured on the server" });
        }

        console.log(`[AI-CHAT] Using API Key (length: ${process.env.GEMINI_API_KEY.length})`);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Convert history to Gemini format
        let formattedHistory = history ? history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        })) : [];

        // Gemini history must start with 'user' role. 
        // If it starts with 'model' (like the initial greeting), we must remove it.
        if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
            console.log("[AI-CHAT] Removing initial non-user message from history");
            formattedHistory.shift();
        }

        console.log(`[AI-CHAT] Starting chat with ${formattedHistory.length} history messages`);

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        console.log("[AI-CHAT] Sending message to Gemini...");
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log("[AI-CHAT] Gemini response successful");
        res.json({ reply: text });
    } catch (error) {
        console.error("[AI-CHAT] Error:", error.message);
        console.error("[AI-CHAT] Error Details:", JSON.stringify(error));
        res.status(500).json({
            message: "AI Service Error",
            error: error.message,
            status: error.status || 500
        });
    }
};

module.exports = { chatWithLink };
