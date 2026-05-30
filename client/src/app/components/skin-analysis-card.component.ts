import { Component, Input } from "@angular/core";
import { SkinAnalysis } from "../models";
import { SwatchComponent } from "./swatch.component";

@Component({
  selector: "app-skin-analysis-card",
  standalone: true,
  imports: [SwatchComponent],
  template: `
    <div class="card">
      <h2 class="font-serif headline">You're a {{ analysis.seasonalPalette }} ✨</h2>
      <p class="friendly">{{ friendlyDescription }}</p>

      <details class="details">
        <summary>Details</summary>
        <div class="stats">
          @for (stat of stats; track stat.label) {
            <div class="stat">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
          }
        </div>
      </details>

      <div class="swatches-row large">
        <app-swatch [hex]="analysis.dominantSkinHex" label="Dominant skin" [large]="true" />
        <app-swatch [hex]="analysis.secondarySkinHex" label="Secondary tone" [large]="true" />
        <span class="confidence">Confidence: {{ analysis.confidence }}%</span>
      </div>

      <h3 class="font-serif section-label">Recommended families</h3>
      <div class="swatches-row wrap">
        @for (s of recommendedSwatches; track s.hex + s.label) {
          <app-swatch [hex]="s.hex" [label]="s.label" [tag]="s.tag" />
        }
      </div>

      <h3 class="font-serif section-label avoid">Colors to avoid</h3>
      <div class="swatches-row avoid-row">
        @for (c of avoidSwatches; track c.hex + c.label) {
          <div class="avoid-item">
            <app-swatch [hex]="c.hex" [label]="c.label" />
            <div class="reason">{{ c.reason }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .card { background: #FAF6F1; border-left: 6px solid #D98B5A; padding: 1rem 1rem; border-radius: 10px; }
      .headline { font-size: 1.5rem; margin: 0 0 0.25rem; }
      .friendly { color: #5b4a3b; font-size: 0.95rem; line-height: 1.4; margin: 0 0 1rem; }
      .details summary { cursor: pointer; font-weight: 600; margin-bottom: 0.5rem; }
      .stats { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin: 0.5rem 0 1rem; }
      .stat { background: #fff; border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
      .stat-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: #7a6b5e; }
      .stat-value { display: block; margin-top: 0.25rem; text-transform: capitalize; }
      .swatches-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; }
      .swatches-row.large { align-items: center; }
      .swatches-row.wrap { gap: 1rem; }
      .confidence { font-size: 0.75rem; color: #7a6b5e; }
      .section-label { font-size: 1rem; margin: 0.75rem 0 0.5rem; font-family: serif; }
      .avoid { margin-top: 0.75rem; }
      .avoid-row { display:flex; gap:1rem; flex-wrap:wrap; }
      .avoid-item { display:flex; flex-direction:column; align-items:center; gap:0.25rem; max-width:110px }
      .reason { font-size:0.75rem; color:#7a6b5e; text-align:center }
    `,
  ],
})
export class SkinAnalysisCardComponent {
  @Input({ required: true }) analysis!: SkinAnalysis;

  get stats() {
    return [
      { label: "Undertone", value: this.analysis.undertone },
      { label: "Depth", value: this.analysis.depth },
      { label: "Fitzpatrick", value: this.analysis.fitzpatrickScale },
      { label: "Seasonal palette", value: this.analysis.seasonalPalette },
    ];
  }

  get friendlyDescription() {
    const tone = this.analysis.undertone.toLowerCase();
    return `Warm, flattering hues like terracotta, mustard, and camel will bring out your natural glow. Choose earthy lip and cheek tones, warm metallic accents, and richer neutrals for clothing to complement your ${this.analysis.seasonalPalette.toLowerCase()} profile.`;
  }

  recommendedSwatches = [
    { label: "Terracotta", hex: "#C4622D", tag: "All" },
    { label: "Burnt Sienna", hex: "#8B4513", tag: "Lipstick" },
    { label: "Olive Green", hex: "#6B7C3A", tag: "Clothing" },
    { label: "Rust", hex: "#B7410E", tag: "Eyeshadow" },
    { label: "Mustard", hex: "#E1AD01", tag: "Clothing" },
    { label: "Camel", hex: "#C19A6B", tag: "Clothing" },
    { label: "Deep Teal", hex: "#2F6B6B", tag: "All" },
    { label: "Gold", hex: "#CFB53B", tag: "All" },
  ];

  avoidSwatches = [
    { label: "Baby Pink", hex: "#F4C2C2", reason: "Too cool, washes out your warmth" },
    { label: "Icy Lavender", hex: "#E6E6FA", reason: "Creates ashy contrast against skin" },
    { label: "Cool Grey", hex: "#A9A9A9", reason: "Flattens your natural glow" },
    { label: "Electric Blue", hex: "#0066FF", reason: "High contrast, pulls attention from face" },
    { label: "Pale Mint", hex: "#C7F0D8", reason: "Too pastel, looks distant on warm skin" },
    { label: "Neon Fuchsia", hex: "#FF00AF", reason: "Too cold and vivid for warm palettes" },
  ];

  shopHref(label: string) {
    const encoded = encodeURIComponent(label);
    return `?color=${encoded}#step2`;
  }
}
