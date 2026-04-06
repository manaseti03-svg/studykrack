const { GoogleGenerativeAI } = require("@google/generative-ai");

const KEY = "AIzaSyBBQXR5gIT9OQkD6D-Ajsjqf7uNaqzhI-U";

async function checkModels() {
  const genAI = new GoogleGenerativeAI(KEY);
  try {
    console.log("TESTING gemini-1.5-flash...");
    const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const flashResult = await flashModel.generateContent("Hello!");
    console.log("gemini-1.5-flash SUCCESS:", flashResult.response.text());
  } catch (err) {
    console.error("DEBUG ERROR (FLASH):", err.message);
    
    console.log("TESTING gemini-pro...");
    try {
      const proModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const proResult = await proModel.generateContent("Hello!");
      console.log("gemini-pro SUCCESS:", proResult.response.text());
    } catch (proErr) {
      console.error("DEBUG ERROR (PRO):", proErr.message);
    }
  }
}

checkModels();
