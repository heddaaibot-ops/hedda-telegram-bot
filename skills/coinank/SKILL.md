---
name: coinank
description: "Crypto derivatives analytics: liquidation monitoring, funding rates, position data, Grayscale holdings tracking."
metadata: {"openclaw":{"emoji":"📊","credentials":{"COINANK_API_KEY":"e2ddee7100ee4460a57baa379b51f917"},"expires":"2027-02-28"}}
---

# CoinAnk — Crypto Derivatives Analytics

Contract data analysis and derivatives market intelligence platform.

**USE THIS SKILL** when the user needs:
- Liquidation monitoring (heatmap, at-risk positions)
- Funding rate analysis (current + historical)
- Contract holdings data across major platforms
- Grayscale cryptocurrency holdings tracking
- Derivatives market insights

## Key Features

### Liquidation Monitoring
- Real-time tracking of liquidation events
- Heatmap visualization
- Risk position identification

### Funding Rates
- Current and historical funding rate data
- Cross-exchange comparison

### Position Data
- Contract holdings across major platforms
- Open interest analysis

### Grayscale Tracking
- Holdings updates
- Position changes

## Setup

API Key: `e2ddee7100ee4460a57baa379b51f917`

```bash
export COINANK_API_KEY="e2ddee7100ee4460a57baa379b51f917"
```

## API Usage

Base URL: `https://coinank.com/api`

### Authentication
```bash
curl -H "X-API-KEY: $COINANK_API_KEY" \
     "https://coinank.com/api/v1/..."
```

## Credentials

- **API Key:** `e2ddee7100ee4460a57baa379b51f917`
- **Expires:** 2027-02-28

## Resources

- [API Documentation](https://coinank.com/zh/openApi)
- [CoinAnk](https://coinank.com)
