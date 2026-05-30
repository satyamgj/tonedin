export class ModelResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "ModelResponseError";
  }
}

export function parseModelJson(raw) {
  const trimmed = raw.trim();

  if (/^I'?m sorry|I cannot|I can't|unable to|cannot assist/i.test(trimmed)) {
    const firstLine = trimmed.split("\n")[0].replace(/^I'm sorry,?\s*/i, "");
    throw new ModelResponseError(
      firstLine.length > 20
        ? firstLine.slice(0, 280)
        : "The model could not analyze this image. Try a clearer photo."
    );
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = fenced ? fenced[1].trim() : trimmed;

  if (!jsonStr.startsWith("{")) {
    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch) jsonStr = objectMatch[0];
  }

  try {
    return JSON.parse(jsonStr);
  } catch {
    throw new ModelResponseError(
      "Could not read the analysis result. Please try again."
    );
  }
}

export function getModelErrorField(data) {
  const err = data?.error;
  if (typeof err === "string" && err.trim()) return err.trim();
  return null;
}
