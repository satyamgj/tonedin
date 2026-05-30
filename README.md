# TonedIn

AI-powered skin tone analysis and beauty product matching.

- **Angular** frontend (`client/`)
- **Express** Node.js API (`server/`)

## Features

1. **Skin analysis** — upload your portrait for undertone, depth, hex swatches, and color recommendations.
2. **Product matching** — enter brand, product name, category, and upload a product image; get a match % with reasons.

## Setup

```bash
# Install dependencies (root + server + client)
npm install
npm run install:all

# Add OpenAI key
cp server/.env.example server/.env
# Edit server/.env and set OPENAI_API_KEY

# Run API + Angular app
npm run dev
```

- **App:** http://localhost:4200  
- **API:** http://localhost:3001  

## Project structure

```
client/          Angular app (port 4200, proxies /api → server)
server/          Express API (port 3001)
  lib/           OpenAI helpers
  routes/        analyze-skin, match-product
```

## API

| Endpoint | Method | Body |
|----------|--------|------|
| `/api/analyze-skin` | POST | `{ imageBase64, mimeType }` |
| `/api/match-product` | POST | `{ skinAnalysis, imageBase64, mimeType, specifications }` |

`specifications`: `{ brand, productName, category }`

## Security

Never commit `server/.env` or share API keys publicly.
