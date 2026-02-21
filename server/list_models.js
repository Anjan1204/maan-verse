const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const listModels = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY not found in .env");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // The SDK doesn't have a direct listModels in the main export usually, 
        // but we can try to fetch from the API directly or use a known one.
        // Actually, let's just try 'gemini-pro' which we know worked before.

        console.log("Testing 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("✅ 'gemini-pro' works!");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("❌ 'gemini-pro' failed:", error.message);

        console.log("\nTesting 'gemini-1.5-flash'...");
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("test");
            console.log("✅ 'gemini-1.5-flash' works!");
        } catch (e) {
            console.error("❌ 'gemini-1.5-flash' failed:", e.message);
        }
    }
};

listModels();
