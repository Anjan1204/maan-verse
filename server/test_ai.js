const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const testAI = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY not found in .env");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Generating content...");
        const result = await model.generateContent("Say hello!");
        console.log("✅ AI Response:", result.response.text());
    } catch (error) {
        console.error("❌ AI Test Failed Status:", error.status);
        console.error("❌ AI Test Failed Message:", error.message);
    }
};

testAI();
