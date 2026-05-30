import { Component, Input } from "@angular/core";
import { ProductMatch, ProductSpecifications } from "../models";

const VERDICT_STYLES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  excellent: { label: "Excellent match", color: "#2d6a4f", bg: "#d8f3dc" },
  good: { label: "Good match", color: "#4a7c59", bg: "#e8f5e9" },
  moderate: { label: "Moderate match", color: "#9a6b2f", bg: "#fff3cd" },
  poor: { label: "Poor match", color: "#9b4d4d", bg: "#fde8e8" },
};

@Component({
  selector: "app-product-match-card",
  standalone: true,
  template: `
    <div class="card">
      <div class="header">
        <div>
          <p class="meta">
            {{ specs.category }}
            @if (specs.brand) { · {{ specs.brand }} }
          </p>
          <h3 class="font-serif name">{{ specs.productName || "Product" }}</h3>
        </div>
        <span class="badge" [style.color]="style.color" [style.background]="style.bg">
          {{ style.label }}
        </span>
      </div>

      <div class="score-row">
        <div class="match-ring" [style.--pct]="pct">
          <div class="ring-inner">
            <span class="pct font-serif">{{ pct }}%</span>
            <span class="pct-label">match</span>
          </div>
        </div>
        <div class="color-info">
          <div class="color-dot" [style.background-color]="match.productColorHex"></div>
          <div>
            <p class="color-name">{{ match.productColorName }}</p>
            <p class="color-hex">{{ match.productColorHex }}</p>
          </div>
        </div>
      </div>

      <p class="summary">{{ match.summary }}</p>

      <h4 class="reasons-title">Why this score</h4>
      <ul class="reasons">
        @for (r of match.reasons; track r) {
          <li>{{ r }}</li>
        }
      </ul>

      @if (match.tips.length) {
        <div class="tips">
          <h4>Tips</h4>
          @for (t of match.tips; track t) {
            <p>{{ t }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .header { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; }
      .meta { margin: 0; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
      .name { margin: 0.25rem 0 0; font-size: 1.25rem; }
      .badge { border-radius: 999px; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; }
      .score-row { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; margin: 1.5rem 0; }
      .ring-inner {
        width: 6.5rem; height: 6.5rem; border-radius: 50%; background: #fff;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
      }
      .pct { font-size: 1.75rem; color: var(--accent); line-height: 1; }
      .pct-label { font-size: 0.625rem; text-transform: uppercase; color: var(--muted); }
      .color-info { display: flex; align-items: center; gap: 1rem; }
      .color-dot { width: 3.5rem; height: 3.5rem; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px var(--border); }
      .color-name { margin: 0; font-weight: 500; }
      .color-hex { margin: 0; font-family: monospace; font-size: 0.75rem; color: var(--muted); }
      .summary { font-size: 0.875rem; line-height: 1.5; }
      .reasons-title { font-size: 0.875rem; margin: 1rem 0 0.5rem; }
      .reasons { margin: 0; padding-left: 1.25rem; color: var(--muted); font-size: 0.875rem; }
      .reasons li { margin-bottom: 0.35rem; }
      .tips { margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 0.75rem; background: var(--accent-soft); }
      .tips h4 { margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--accent); }
      .tips p { margin: 0 0 0.25rem; font-size: 0.875rem; }
    `,
  ],
})
export class ProductMatchCardComponent {
  @Input({ required: true }) match!: ProductMatch;
  @Input({ required: true }) specs!: ProductSpecifications;

  get pct(): number {
    return Math.min(100, Math.max(0, Number(this.match.matchPercentage) || 0));
  }

  get style() {
    return VERDICT_STYLES[this.match.verdict] ?? VERDICT_STYLES["moderate"];
  }
}
