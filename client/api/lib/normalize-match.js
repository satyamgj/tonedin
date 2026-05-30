import { ModelResponseError } from "./parse-json.js";

const VERDICTS = ["excellent", "good", "moderate", "poor"];

export function normalizeProductMatch(raw) {
  const pctRaw = raw.matchPercentage ?? raw.match_percent ?? raw.score;
  const pct = Number(pctRaw);
  if (!Number.isFinite(pct)) {
    throw new ModelResponseError(
      "The match score could not be calculated. Please try again."
    );
  }

  const matchPercentage = Math.round(Math.min(100, Math.max(0, pct)));

  let verdict = String(raw.verdict ?? "").toLowerCase();
  if (!VERDICTS.includes(verdict)) {
    if (matchPercentage >= 85) verdict = "excellent";
    else if (matchPercentage >= 70) verdict = "good";
    else if (matchPercentage >= 50) verdict = "moderate";
    else verdict = "poor";
  }

  const hex = String(raw.productColorHex ?? raw.product_color_hex ?? "#CCCCCC");
  const validHex = /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : "#CCCCCC";

  const reasons = Array.isArray(raw.reasons)
    ? raw.reasons.map(String).filter(Boolean)
    : [];

  const tips = Array.isArray(raw.tips)
    ? raw.tips.map(String).filter(Boolean)
    : [];

  return {
    matchPercentage,
    verdict,
    productColorHex: validHex,
    productColorName: String(
      raw.productColorName ?? raw.product_color_name ?? "Product color"
    ),
    reasons:
      reasons.length > 0
        ? reasons
        : ["Score based on undertone and shade compatibility."],
    tips,
    summary: String(raw.summary ?? "Match analysis complete."),
  };
}
