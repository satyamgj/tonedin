import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-swatch",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="swatch-wrap">
      <div class="dot" [class.large]="large" [style.background-color]="hex"></div>
      <div class="meta">
        <span class="label">{{ label }}</span>
        <span class="hex">{{ hex }}</span>
      </div>
      <span *ngIf="tag" class="tag">{{ tag }}</span>
    </div>
  `,
  styles: [
    `
      .swatch-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }
      .dot {
        width: 3rem;
        height: 3rem;
        border-radius: 8px;
        border: 2px solid #fff;
        box-shadow: 0 6px 12px rgba(0,0,0,0.06);
      }
      .dot.large {
        width: 4.5rem;
        height: 4.5rem;
      }
      .label {
        font-size: 0.65rem;
        color: var(--muted);
        text-align: center;
        max-width: 5.5rem;
      }
      .hex {
        font-family: monospace;
        font-size: 0.625rem;
        color: var(--muted);
      }
      .meta { display:flex; flex-direction:column; align-items:center; gap:0.125rem }
      .tag { font-size:0.65rem; background:rgba(0,0,0,0.04); padding:2px 6px; border-radius:999px; color:var(--muted); }
      .action { font-size:0.75rem; color:var(--accent); text-decoration:none; margin-top:4px }
    `,
  ],
})
export class SwatchComponent {
  @Input({ required: true }) hex!: string;
  @Input({ required: true }) label!: string;
  @Input() large = false;
  @Input() tag?: string;
}
