import { PRODUCT_MATCH_SYSTEM } from "./lib/prompts.js";
import { ModelResponseError } from "./lib/parse-json.js";
import { normalizeProductMatch } from "./lib/normalize-match.js";
import { callVisionJson } from "./lib/vision-json.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { skinAnalysis, imageBase64, mimeType, specifications } = req.body ?? {};

    if (!skinAnalysis) return res.status(400).json({ error: "Complete skin analysis first." });
    if (!imageBase64 || !mimeType) return res.status(400).json({ error: "Product image is required." });

    const brand = specifications?.brand?.trim() ?? "";
    const productName = specifications?.productName?.trim() ?? "";
    const category = specifications?.category?.trim() ?? "other";

    if (!brand) return res.status(400).json({ error: "Brand is required." });
    if (!productName) return res.status(400).json({ error: "Product name is required." });

    const specsText = `Brand: ${brand}\nProduct name: ${productName}\nCategory: ${category}`;

    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    const userContext = `User skin profile JSON:\n${JSON.stringify(skinAnalysis, null, 2)}\n\nProduct:\n${specsText}\n\nScore how well this product suits this user. You must return matchPercentage as an integer 0-100. Use the product image to identify the true pigment color.`;

    const rawMatch = await callVisionJson({
      system: PRODUCT_MATCH_SYSTEM,
      userText: userContext,
      imageDataUrl: dataUrl,
      maxTokens: 1200,
      temperature: 0.35,
    });

    const match = normalizeProductMatch(rawMatch);

    res.json({ match, product: { brand, productName, category } });
  } catch (err) {
    console.error("match-product:", err);
    const message =
      err instanceof ModelResponseError ? err.message : err.message || "Product matching failed";
    res.status(err instanceof ModelResponseError ? 422 : 500).json({ error: message });
  }
}
