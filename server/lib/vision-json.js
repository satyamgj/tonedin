import { getOpenAIClient, VISION_MODEL } from "./openai.js";
import {
  getModelErrorField,
  ModelResponseError,
  parseModelJson,
} from "./parse-json.js";

export async function callVisionJson(options) {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: VISION_MODEL,
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 1500,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: options.system },
      {
        role: "user",
        content: [
          { type: "text", text: options.userText },
          {
            type: "image_url",
            image_url: { url: options.imageDataUrl, detail: "high" },
          },
        ],
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new ModelResponseError("No response from the analysis service.");
  }

  const parsed = parseModelJson(content);
  const modelError = getModelErrorField(parsed);
  if (modelError) {
    throw new ModelResponseError(modelError);
  }

  return parsed;
}
