---
name: surf
description: "Crypto intelligence API: market analytics, on-chain data, token tracking, sentiment analysis across 40+ blockchains and 200+ data sources."
metadata: {"openclaw":{"emoji":"🏄","credentials":{"SURF_API_KEY":"sk-JEDeCHwScjDmEWLpfHi0GqHDsdo8pRHXHNKga9M7vQs"},"expires":"2027-02-28"}}
---

# Surf — Crypto Intelligence API

AI-powered crypto intelligence platform combining on-chain data, market analytics, and social sentiment.

**USE THIS SKILL** when the user needs:
- Market and technical metrics
- Token movement tracking
- Derivatives data
- Sentiment analysis
- Cross-chain monitoring
- Protocol research
- Market signal detection

## Coverage

- **40+ blockchains**
- **200+ data sources**
- **100k+ verified crypto voices**

## Setup

API Key: `sk-JEDeCHwScjDmEWLpfHi0GqHDsdo8pRHXHNKga9M7vQs`

```bash
export SURF_API_KEY="sk-JEDeCHwScjDmEWLpfHi0GqHDsdo8pRHXHNKga9M7vQs"
```

## API Endpoints

Base URL: `https://api.asksurf.ai/surf-ai`

### Authentication
```bash
curl -H "Authorization: Bearer $SURF_API_KEY" \
     "https://api.asksurf.ai/surf-ai/v1/chat/completions"
```

### Chat Completions (Main Endpoint)
```bash
curl -X POST "https://api.asksurf.ai/surf-ai/v1/chat/completions" \
  -H "Authorization: Bearer $SURF_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "surf-1.5-instant",
    "messages": [{"role": "user", "content": "BTC price"}],
    "stream": false
  }'
```

### Available Models
- `surf-1.5` — Full model (recommended, timeout 10min)
- `surf-1.5-instant` — Fast responses
- `surf-1.5-thinking` — With reasoning
- `surf-ask` — Legacy
- `surf-research` — Legacy (timeout 10min)

### Optional Parameters
- `stream`: boolean — SSE streaming
- `reasoning_effort`: "low" | "medium" | "high"
- `ability`: ["search", "evm_onchain", "solana_onchain", "market_analysis", "calculate"]
- `citation`: ["source", "chart"]

### Key Use Cases

1. **Trading & Finance**
   - Exchanges, wallets, trading bots, payment systems

2. **Data & Analytics**
   - Dashboards, portfolio trackers, block explorers, research terminals

3. **AI & Innovation**
   - AI agents, DeFi protocols, NFT platforms

## Credentials

- **API Key:** `sk-JEDeCHwScjDmEWLpfHi0GqHDsdo8pRHXHNKga9M7vQs`
- **Expires:** 2027-02-28

## Resources

- [Documentation](https://docs.asksurf.ai/overview)
- [Surf AI](https://asksurf.ai)
