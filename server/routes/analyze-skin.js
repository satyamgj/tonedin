import { Router } from "express";
import { SKIN_ANALYSIS_SYSTEM } from "../lib/prompts.js";
import { ModelResponseError } from "../lib/parse-json.js";
import { callVisionJson } from "../lib/vision-json.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body ?? {};

    if (!imageBase64 || !mimeType) {
      return res
        .status(400)
        .json({ error: "imageBase64 and mimeType are required" });
    }

    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    const analysis = await callVisionJson({
      system: SKIN_ANALYSIS_SYSTEM,
      userText:
        "Analyze visible skin in this portrait for beauty color matching. Return JSON with undertone, depth, hex swatches, and recommendations.",
      imageDataUrl: dataUrl,
      maxTokens: 1500,
      temperature: 0.3,
    });

    res.json({ analysis });
  } catch (err) {
    console.error("analyze-skin:", err);
    const message =
      err instanceof ModelResponseError
        ? err.message
        : err.message || "Skin analysis failed";
    res.status(err instanceof ModelResponseError ? 422 : 500).json({ error: message });
  }
});

export default router;
