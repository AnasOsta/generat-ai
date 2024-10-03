import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const body = await request.json();
    const { messages } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new Response("Gemini API key not found", { status: 500 });
    }

    if (!messages) {
      return new Response("No messages provided", { status: 400 });
    }

    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {
              text: " I have the ingredients above. Not sure what to cook for lunch. Show me a list of foods with the recipes.",
            },
          ],
        },
      ],
    });
    const result = await chatSession.sendMessage(messages);
    return new Response(result.response.text());
  } catch (err) {
    console.log(err);
    return new Response("Internal Error", { status: 500 });
  }
}
