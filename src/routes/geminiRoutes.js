const express = require("express");
const multer = require("multer");
const geminiRouter = express.Router();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Setup multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

geminiRouter.post("/generate", upload.single("image"), async (req, res) => {
    const { prompt } = req.body;
    const imageFile = req.file; // this will contain image info if uploaded

    if (!prompt) {
        return res.status(400).json({ msg: "Prompt is required" });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({ data: response.text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ msg: "Failed to generate component" });
    }
});

module.exports = geminiRouter;
