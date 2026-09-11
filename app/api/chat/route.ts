import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
    });

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