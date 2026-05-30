import OpenAI from "openai";

export const VISION_MODEL = "gpt-4o";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to Vercel project settings");
  }
  return new OpenAI({ apiKey });
}
