import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { ImageUploadComponent } from "./components/image-upload.component";
import { ProductMatchCardComponent } from "./components/product-match-card.component";
import { SkinAnalysisCardComponent } from "./components/skin-analysis-card.component";
import {
  ProductCategory,
  ProductSpecifications,
  SavedMatch,
  SkinAnalysis,
} from "./models";
import { ApiService } from "./services/api.service";
import { compressImage, fileToBase64 } from "./utils/image.util";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "lipstick", label: "Lipstick" },
  { value: "blush", label: "Blush" },
  { value: "foundation", label: "Foundation" },
  { value: "eyeshadow", label: "Eyeshadow" },
  { value: "other", label: "Other" },
];

const EMPTY_SPECS: ProductSpecifications = {
  brand: "",
  productName: "",
  category: "lipstick",
};

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FormsModule,
    ImageUploadComponent,
    SkinAnalysisCardComponent,
    ProductMatchCardComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  categories = CATEGORIES;

  facePreview: string | null = null;
  productPreview: string | null = null;
  skinAnalysis: SkinAnalysis | null = null;
  matches: SavedMatch[] = [];

  specs: ProductSpecifications = { ...EMPTY_SPECS };
  productImageFile: File | null = null;

  loadingSkin = false;
  loadingProduct = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    try {
      const params = new URL(window.location.href).searchParams;
      const color = params.get("color");
      if (color) {
        this.specs.productName = decodeURIComponent(color);
        setTimeout(() => document.getElementById("step2")?.scrollIntoView({ behavior: "smooth" }), 150);
      }
    } catch (e) {
      // ignore
    }
  }

  onFaceSelected(file: File) {
    this.error = null;
    this.loadingSkin = true;
    this.skinAnalysis = null;
    this.matches = [];
    this.facePreview = URL.createObjectURL(file);

    compressImage(file)
      .then((compressed) => fileToBase64(compressed))
      .then(({ base64, mimeType }) =>
        firstValueFrom(this.api.analyzeSkin(base64, mimeType))
      )
      .then((res) => {
        this.skinAnalysis = res.analysis;
      })
      .catch((e: unknown) => {
        this.error = this.formatError(e, "Could not analyze skin tone");
        this.facePreview = null;
      })
      .finally(() => (this.loadingSkin = false));
  }

  onProductImageSelected(file: File) {
    this.productImageFile = file;
    this.productPreview = URL.createObjectURL(file);
  }

  matchProduct() {
    if (!this.skinAnalysis) {
      this.error = "Analyze your skin tone first (Step 1).";
      return;
    }
    if (!this.productImageFile) {
      this.error = "Upload a product image.";
      return;
    }
    if (!this.specs.brand.trim()) {
      this.error = "Enter the brand.";
      return;
    }
    if (!this.specs.productName.trim()) {
      this.error = "Enter the product name.";
      return;
    }

    this.error = null;
    this.loadingProduct = true;

    compressImage(this.productImageFile)
      .then((compressed) => fileToBase64(compressed))
      .then(({ base64, mimeType }) =>
        firstValueFrom(
          this.api.matchProduct(
            this.skinAnalysis!,
            base64,
            mimeType,
            this.specs
          )
        )
      )
      .then((res) => {
        if (!res?.match || typeof res.match.matchPercentage !== "number") {
          throw new Error("No match score returned. Please try again.");
        }
        this.matches = [
          {
            id: crypto.randomUUID(),
            match: res.match,
            specifications: { ...this.specs },
          },
          ...this.matches,
        ];
        this.resetProductForm();
      })
      .catch((e: unknown) => {
        this.error = this.formatError(e, "Could not match product");
      })
      .finally(() => (this.loadingProduct = false));
  }

  formatError(e: unknown, fallback: string): string {
    if (e instanceof HttpErrorResponse) {
      const body = e.error as { error?: string };
      return body?.error ?? fallback;
    }
    if (e instanceof Error) return e.message;
    return fallback;
  }

  resetProductForm() {
    this.specs = { ...EMPTY_SPECS };
    this.productImageFile = null;
    this.productPreview = null;
  }
}
