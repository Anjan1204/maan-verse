const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithLink = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "Gemini API Key missing on server" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // List of models to try in order of preference
        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
        let lastError = null;

        let formattedHistory = history ? history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
        })) : [];

        if (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
            formattedHistory.shift();
        }

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI-CHAT] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const chat = model.startChat({
                    history: formattedHistory,
                    generationConfig: { maxOutputTokens: 1000 },
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                console.log(`[AI-CHAT] Success with model: ${modelName}`);
                return res.json({ reply: text });
            } catch (error) {
                console.error(`[AI-CHAT] Failed with model ${modelName}:`, error.message);
                lastError = error;
                // If it's not a 404, we might want to stop, but for now let's try all
                continue;
            }
        }

        // If we reach here, all models failed
        throw lastError;

    } catch (error) {
        console.error("[AI-CHAT] Final Error:", error.message);
        res.status(500).json({
            message: "AI Service Error",
            error: error.message,
            tip: "Check if your Gemini API key is active and supports the requested models."
        });
    }
};

module.exports = { chatWithLink };
