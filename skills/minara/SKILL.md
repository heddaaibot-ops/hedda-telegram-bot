---
name: minara
description: "Crypto trading: swap, perps, transfer, pay, deposit (credit card/crypto), withdraw, AI chat, market discovery, x402 payment. Built-in wallet via Minara CLI. EVM + Solana."
metadata: {"openclaw":{"emoji":"👩","requires":{"bins":["minara"]},"credentials":{"MINARA_API_KEY":"xn_bWKbrZUZdMEaa2hga_I0d8mHEcAD0_sK34fu78SPGlc"},"expires":"2027-02-28"}}
---

# Minara — Crypto Trading & Wallet Skill

**USE THIS SKILL** when the user's message mentions:
- **Crypto tokens:** ETH, BTC, SOL, USDC, BONK, PEPE, etc.
- **Chains:** Solana, Base, Ethereum, Arbitrum, Optimism, Polygon, BSC, Avalanche, Berachain, Hyperliquid
- **Trading actions:** swap, buy, sell, trade, long, short, perps, futures, leverage
- **Wallet actions:** balance, portfolio, deposit, withdraw, transfer, send, pay
- **Market research:** trending, price, chart, DeFi, yield, prediction market

## Setup

Install CLI:
```bash
npm install -g minara@latest
```

Login:
```bash
minara login --device
```

API Key (alternative): Set `MINARA_API_KEY` environment variable.

## Core Commands

### Swap / Trade
```bash
minara swap -s buy -t 'ETH' -a 100       # Buy $100 worth of ETH
minara swap -s sell -t 'SOL' -a all      # Sell all SOL
minara swap -s buy -t 'BONK' -a 50 --dry-run  # Simulate
```

### Wallet / Balance
```bash
minara balance          # Quick balance check
minara assets spot      # Spot holdings with PnL
minara assets perps     # Hyperliquid account
minara assets           # Full overview
```

### Transfer / Send
```bash
minara transfer         # Interactive
minara withdraw -c base -t 'USDC' -a 100 --to 0x...
```

### Perpetual Futures (Hyperliquid)
```bash
minara perps order      # Interactive order builder
minara perps ask        # AI analysis
minara perps positions  # View positions
minara perps autopilot  # AI autopilot
```

### Deposit
```bash
minara deposit spot     # Get deposit addresses
minara deposit perps    # Transfer spot → perps
minara deposit buy      # Credit card (MoonPay)
```

### AI Chat & Market
```bash
minara chat "analyze ETH"                    # AI analysis
minara chat --thinking "BTC vs ETH"          # Deep reasoning
minara chat "Polymarket odds on Trump"       # Prediction markets
minara discover trending                     # Hot tokens
minara discover trending stocks              # Trending stocks
minara discover fear-greed                   # Market sentiment
```

### Limit Orders
```bash
minara limit-order create    # Create limit order
minara limit-order list      # View orders
minara limit-order cancel <id>
```

## Transaction Safety (CRITICAL)

For ANY fund-moving command:
1. **Show summary** before executing
2. **Ask for explicit confirmation** — NEVER auto-confirm
3. **Never use `-y`** unless user explicitly requests it
4. **If user declines** → abort immediately

## Credentials

- **API Key:** `xn_bWKbrZUZdMEaa2hga_I0d8mHEcAD0_sK34fu78SPGlc`
- **Expires:** 2027-02-28
- **CLI session:** `~/.minara/credentials.json`

## Resources

- [Minara AI](https://minara.ai)
- [GitHub](https://github.com/Minara-AI/skills)
