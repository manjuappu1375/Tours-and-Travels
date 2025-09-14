// server/utils/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generate any generic AI content.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateContent(prompt) {
  if (!ai) {
    throw new Error("Google Generative AI client not initialized. Missing GEMINI_API_KEY?");
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return "Sorry, I couldn’t generate content right now.";
  }
}

/**
 * Generate a short travel tip for a given destination.
 * @param {string} destination
 * @returns {Promise<string>}
 */
export async function generateTravelTip(destination) {
  const prompt = `Give me a short, fun, and useful travel tip for someone visiting ${destination}.`;
  return await generateContent(prompt);
}
