export type ProductCategory =
  | "lipstick"
  | "blush"
  | "foundation"
  | "eyeshadow"
  | "other";

export interface ColorSwatch {
  hex: string;
  label: string;
  tag?: string;
}

export interface SkinAnalysis {
  undertone: string;
  depth: string;
  fitzpatrickScale: string;
  dominantSkinHex: string;
  secondarySkinHex: string;
  seasonalPalette: string;
  colorSwatches: ColorSwatch[];
  recommendedColorFamilies: string[];
  colorsToAvoid: { hex: string; label: string; reason: string }[];
  summary: string;
  confidence: number;
}

export interface ProductMatch {
  matchPercentage: number;
  verdict: "excellent" | "good" | "moderate" | "poor";
  productColorHex: string;
  productColorName: string;
  reasons: string[];
  tips: string[];
  summary: string;
}

export interface ProductSpecifications {
  brand: string;
  productName: string;
  category: ProductCategory;
}

export interface SavedMatch {
  id: string;
  match: ProductMatch;
  specifications: ProductSpecifications;
}
