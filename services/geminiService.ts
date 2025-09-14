// Using 'any' type for the AI client because we'll be importing it dynamically.
let ai: any | null = null;

/**
 * Dynamically imports and initializes the GoogleGenAI client.
 * This "lazy loading" approach prevents the entire app from failing to load
 * if there's an issue with the @google/genai module or API key initialization.
 * The module is only imported and the client created the first time it's needed.
 */
const getAiClient = async () => {
  if (!ai) {
    // Dynamically import the library.
    const { GoogleGenAI } = await import('@google/genai');

    // IMPORTANT: Do NOT hardcode the API key. This is configured externally.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // This will throw an error when the function is called, but not on app load.
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const generateTravelTip = async (tourTitle: string, tourLocation: string): Promise<string> => {
  const prompt = `Give me a single, short pro travel tip for a trip to ${tourLocation}, specific to a tour called "${tourTitle}". Make it sound like an insider tip. Keep it under 200 characters. Do not use markdown or any special formatting.`;

  try {
    // Await the client, as it's now loaded asynchronously.
    const client = await getAiClient();
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Use response.text to get the generated content.
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from AI model.");
  }
};
