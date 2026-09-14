import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey,
});

async function generateWithRetry(message: string) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
      });

      return response;
    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error);

      // If this was the last attempt, give up
      if (attempt === maxAttempts) {
        throw error;
      }

      // Wait 1s, then 2s
      const delay = 1000 * Math.pow(2, attempt - 1);

      console.log(`Retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Gemini request failed");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body.message;

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await generateWithRetry(message);

    return Response.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return Response.json(
      {
        error: "Failed to generate AI response.",
      },
      {
        status: 500,
      }
    );
  }
}