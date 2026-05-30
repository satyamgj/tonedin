import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ProductMatch,
  ProductSpecifications,
  SkinAnalysis,
} from "../models";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class ApiService {
  constructor(private http: HttpClient) {}

  analyzeSkin(
    imageBase64: string,
    mimeType: string
  ): Observable<{ analysis: SkinAnalysis }> {
    const base = environment.apiUrl || "";
    return this.http.post<{ analysis: SkinAnalysis }>(`${base}/api/analyze-skin`, {
      imageBase64,
      mimeType,
    });
  }

  matchProduct(
    skinAnalysis: SkinAnalysis,
    imageBase64: string,
    mimeType: string,
    specifications: ProductSpecifications
  ): Observable<{
    match: ProductMatch;
    product: Partial<ProductSpecifications>;
  }> {
    const base = environment.apiUrl || "";
    return this.http.post<{
      match: ProductMatch;
      product: Partial<ProductSpecifications>;
    }>(`${base}/api/match-product`, {
      skinAnalysis,
      imageBase64,
      mimeType,
      specifications,
    });
  }
}
