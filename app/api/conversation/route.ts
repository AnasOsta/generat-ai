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
  const { messages } = await request.json();
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
  console.log(result.response.text());

  return new Response(result.response.text());
}
