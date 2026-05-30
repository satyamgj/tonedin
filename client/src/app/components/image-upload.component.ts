import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-image-upload",
  standalone: true,
  template: `
    <div
      class="upload-zone"
      [class.dragging]="dragging"
      [style.opacity]="disabled ? '0.5' : '1'"
      [style.pointer-events]="disabled ? 'none' : 'auto'"
      (click)="input.click()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragging = false"
      (drop)="onDrop($event)"
    >
      <input
        #input
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        [disabled]="disabled"
        (change)="onFileChange($event)"
      />
      @if (previewUrl) {
        <img [src]="previewUrl" alt="Preview" class="preview" />
      } @else {
        <div class="icon" aria-hidden="true">📷</div>
        <p class="label">{{ label }}</p>
        <p class="hint">{{ hint }}</p>
        <p class="formats">Camera or gallery · drag & drop or click</p>
      }
    </div>
  `,
  styles: [
    `
      .upload-zone {
        display: flex;
        min-height: 220px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        text-align: center;
      }
      .preview {
        max-height: 12rem;
        max-width: 100%;
        border-radius: 0.75rem;
        object-fit: contain;
      }
      .icon {
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--accent-soft);
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
      }
      .label {
        font-weight: 500;
        margin: 0;
      }
      .hint {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--muted);
        max-width: 20rem;
      }
      .formats {
        margin: 0.75rem 0 0;
        font-size: 0.75rem;
        color: var(--muted);
      }
    `,
  ],
})
export class ImageUploadComponent {
  @Input() label = "Upload image";
  @Input() hint = "";
  @Input() previewUrl: string | null = null;
  @Input() disabled = false;
  @Output() fileSelected = new EventEmitter<File>();

  dragging = false;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dragging = true;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file?.type.startsWith("image/")) this.fileSelected.emit(file);
  }

  onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file?.type.startsWith("image/")) this.fileSelected.emit(file);
  }
}
