import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable not set. The Travel Tip feature will be disabled.");
}

// Initialize the client only if the API key exists.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateTravelTip = async (tourTitle, tourLocation) => {
  // If the AI client wasn't initialized, return a default tip.
  if (!ai) {
    return "Remember to pack for all weather conditions and stay hydrated on your trip!";
  }
  
  const prompt = `Give me a single, short pro travel tip for a trip to ${tourLocation}, specific to a tour called "${tourTitle}". Make it sound like an insider tip. Keep it under 200 characters. Do not use markdown or any special formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a fallback tip in case of an API error.
    return "Check local customs and entry requirements before you travel for a smooth journey.";
  }
};
