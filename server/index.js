import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import analyzeSkinRouter from "./routes/analyze-skin.js";
import matchProductRouter from "./routes/match-product.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/analyze-skin", analyzeSkinRouter);
app.use("/api/match-product", matchProductRouter);

app.listen(PORT, () => {
  console.log(`TonedIn API running at http://localhost:${PORT}`);
});
