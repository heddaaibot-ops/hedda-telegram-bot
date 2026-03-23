# 市場微觀結構基礎

## 來源
- **Larry Harris**《Trading and Exchanges: Market Microstructure for Practitioners》

---

## 核心論點

### 1. 交易成本是隱藏的敵人

**交易成本組成**：
```
總交易成本 = 顯性成本 + 隱性成本

顯性成本：
- 手續費
- 平台費用
- 結算費用

隱性成本（更重要）：
- Bid-Ask Spread（買賣價差）
- 市場衝擊（Market Impact）
- 機會成本
```

**對 Polymarket 的意義**：
- 每次交易都在支付 spread
- 小 edge 可能被交易成本吃掉
- 頻繁交易會累積大量隱性成本

### 2. Bid-Ask Spread 的本質

**Spread 存在的原因**：
1. **存貨成本**：做市商持有部位的風險
2. **逆向選擇**：與知情交易者交易的風險
3. **訂單處理成本**：維護系統的成本

**逆向選擇成分**（最重要）：
```
做市商面臨的問題：
- 如果有人大量買入 YES，他們可能知道什麼
- 做市商必須加寬 spread 來保護自己
- 越多知情交易者 → 越寬的 spread
```

### 3. 流動性是一切的基礎

**流動性的四個維度**：

| 維度 | 定義 | 好的情況 |
|------|------|----------|
| 寬度（Width） | Spread 大小 | 窄 spread |
| 深度（Depth） | 訂單簿厚度 | 大量訂單 |
| 即時性（Immediacy） | 執行速度 | 快速成交 |
| 彈性（Resiliency） | 衝擊後恢復 | 快速回復 |

**Polymarket 流動性評估**：
```
✅ 好的市場：
- Spread < 2%
- 訂單簿有深度
- 交易量活躍

⚠️ 注意的市場：
- Spread 2-5%
- 訂單簿薄
- 需要用限價單

❌ 避免的市場：
- Spread > 5%
- 幾乎沒有訂單
- 流動性陷阱
```

### 4. 限價單 vs 市價單的選擇

**市價單（Market Order）**：
- 立即執行
- 支付 spread
- 適合：緊急、小額、流動性好的市場

**限價單（Limit Order）**：
- 設定價格等待成交
- 可能不成交
- 適合：大額、不急、流動性差的市場

**決策框架**：
```
                     急迫性
                 高        低
           ┌─────────┬─────────┐
       高  │ 市價單   │ 限價單   │
流動性    │ (可接受) │ (最優)   │
           ├─────────┼─────────┤
       低  │ 限價單   │ 限價單   │
           │ (必須)   │ (必須)   │
           └─────────┴─────────┘
```

### 5. 交易者類型和生態系統

**市場參與者分類**：

| 類型 | 特徵 | 對你的影響 |
|------|------|-----------|
| 做市商 | 提供流動性，賺 spread | 你的交易對手 |
| 知情交易者 | 有信息優勢 | 你的競爭對手 |
| 套利者 | 消除價格差異 | 保持效率 |
| 噪聲交易者 | 無信息優勢 | 提供利潤來源 |

**關鍵問題**：你是哪類交易者？

---

## 實用框架

### Spread 成本計算

```python
def calculate_spread_cost(bid: float, ask: float, position_size: float) -> dict:
    """
    計算交易 spread 成本

    Args:
        bid: 買價（你賣出的價格）
        ask: 賣價（你買入的價格）
        position_size: 交易金額

    Returns:
        Spread 成本分析
    """
    spread = ask - bid
    spread_percent = spread / ((ask + bid) / 2) * 100

    # 買入成本：從中間價到 ask
    buy_cost = (ask - (ask + bid) / 2) * position_size / ask

    # 賣出成本：從中間價到 bid
    sell_cost = ((ask + bid) / 2 - bid) * position_size / bid

    # 往返成本（買入後賣出）
    round_trip_cost = buy_cost + sell_cost

    return {
        "spread": spread,
        "spread_percent": f"{spread_percent:.2f}%",
        "buy_cost": buy_cost,
        "sell_cost": sell_cost,
        "round_trip_cost": round_trip_cost,
        "breakeven_edge_needed": spread_percent / 2  # 需要的最小 edge
    }

# 範例
result = calculate_spread_cost(bid=0.48, ask=0.52, position_size=100)
# spread: 0.04, spread_percent: 8%, round_trip_cost: ~8
```

### 有效 Edge 計算

```python
def effective_edge(your_prob: float, market_price: float, spread_percent: float) -> dict:
    """
    計算扣除 spread 後的有效 edge

    Args:
        your_prob: 你的概率估計
        market_price: 市場中間價
        spread_percent: Spread 百分比

    Returns:
        有效 edge 分析
    """
    gross_edge = abs(your_prob - market_price)
    spread_cost = spread_percent / 200  # 單邊成本
    net_edge = gross_edge - spread_cost

    return {
        "gross_edge": f"{gross_edge * 100:.1f}%",
        "spread_cost": f"{spread_cost * 100:.1f}%",
        "net_edge": f"{net_edge * 100:.1f}%",
        "trade_recommended": net_edge > 0.03,  # 需要 3% 淨 edge
        "explanation": "淨 edge 需要 > 3% 才值得交易"
    }

# 範例：你認為 60%，市場 50%，spread 4%
result = effective_edge(0.60, 0.50, 4)
# gross_edge: 10%, spread_cost: 2%, net_edge: 8%, trade_recommended: True
```

### 流動性評分系統

```python
def liquidity_score(spread_percent: float, volume_24h: float, depth: float) -> dict:
    """
    評估市場流動性

    Args:
        spread_percent: Spread 百分比
        volume_24h: 24 小時交易量（美元）
        depth: 訂單簿深度（最佳 5 檔總量）

    Returns:
        流動性評分
    """
    # Spread 評分（越窄越好）
    if spread_percent < 2:
        spread_score = 3
    elif spread_percent < 5:
        spread_score = 2
    else:
        spread_score = 1

    # 交易量評分
    if volume_24h > 100000:
        volume_score = 3
    elif volume_24h > 10000:
        volume_score = 2
    else:
        volume_score = 1

    # 深度評分
    if depth > 50000:
        depth_score = 3
    elif depth > 10000:
        depth_score = 2
    else:
        depth_score = 1

    total_score = spread_score + volume_score + depth_score

    return {
        "spread_score": spread_score,
        "volume_score": volume_score,
        "depth_score": depth_score,
        "total_score": total_score,
        "rating": "A" if total_score >= 8 else "B" if total_score >= 5 else "C",
        "recommendation": {
            "A": "可以使用市價單",
            "B": "建議使用限價單",
            "C": "謹慎交易，考慮流動性風險"
        }.get("A" if total_score >= 8 else "B" if total_score >= 5 else "C")
    }
```

---

## Polymarket 應用

### 1. 交易前的流動性檢查

```markdown
## 流動性檢查清單

### 基本指標
- [ ] Spread < 4%？
- [ ] 24h 交易量 > $10,000？
- [ ] 訂單簿有合理深度？

### 進階檢查
- [ ] 我的交易量會造成多大市場衝擊？
- [ ] 如果需要緊急退出，成本是多少？
- [ ] 這個市場的歷史 spread 穩定嗎？

### 決策
- 流動性好 → 可以考慮較大倉位
- 流動性差 → 減小倉位，使用限價單
- 流動性極差 → 考慮不交易
```

### 2. 訂單策略選擇

**根據情況選擇**：

| 情況 | 策略 | 原因 |
|------|------|------|
| 市場即將關閉 | 市價單 | 確保成交 |
| 預期大新聞 | 提前限價單 | 可能有好價格 |
| 日常交易 | 限價單 | 減少成本 |
| 止損 | 市價單 | 風險管理 |

### 3. 大單拆分策略

**問題**：大訂單會推動價格

**解決方案**：
```
原始訂單：$10,000
訂單簿深度：每個價位 $1,000

拆分策略：
- 第 1 單：$1,000
- 等待價格回復
- 第 2 單：$1,000
- 重複...

或使用冰山訂單（如果平台支持）
```

### 4. 流動性風險管理

**規則**：
```
倉位限制 = MIN(
    Kelly 建議倉位,
    訂單簿深度 × 10%,
    24h 交易量 × 5%
)
```

**解釋**：
- 永遠不要讓自己的倉位大到無法退出
- 在流動性不足時主動減少倉位
- 流動性風險 > 錯過機會的風險

---

## 關鍵引言

> **「Bid-Ask Spread 是交易者面臨的最重要的隱性成本。」**
> — Larry Harris

> **「逆向選擇是 spread 存在的主要原因：做市商必須保護自己免受知情交易者的損失。」**
> — Larry Harris

> **「流動性是市場的血液。沒有流動性，價格發現無法正常進行。」**
> — Larry Harris

> **「聰明的交易者知道什麼時候使用限價單，什麼時候使用市價單。錯誤的選擇會侵蝕所有的 edge。」**
> — Larry Harris

---

## 常見錯誤

### 1. 忽略 Spread 成本
**問題**：只看 edge，不看交易成本
**解決**：計算淨 edge = 毛 edge - spread 成本

### 2. 在低流動性市場下大單
**問題**：自己推高了買入價格
**解決**：檢查訂單簿，拆分大單

### 3. 急於成交而使用市價單
**問題**：在 spread 寬的市場付出高昂成本
**解決**：除非緊急，否則用限價單

### 4. 忽略流動性風險
**問題**：進場容易，出場難
**解決**：進場前就規劃好如何退出

### 5. 過度交易
**問題**：頻繁交易累積大量 spread 成本
**解決**：只在有足夠 edge 時交易

---

## Polymarket Spread 經驗法則

```
┌─────────────────────────────────────┐
│  Spread 門檻（對於 10% 毛 edge）：   │
│                                     │
│  Spread < 2%  → 好，可以交易        │
│  Spread 2-4%  → 還可以              │
│  Spread 4-6%  → 謹慎，考慮限價單    │
│  Spread > 6%  → 不建議，成本太高    │
│                                     │
│  記住：                             │
│  淨 Edge = 毛 Edge - (Spread / 2)   │
│                                     │
│  流動性差的市場：                   │
│  - 減少倉位                         │
│  - 使用限價單                       │
│  - 拉長時間框架                     │
└─────────────────────────────────────┘
```

---

## 記憶卡

```
┌─────────────────────────────────────┐
│  交易成本公式：                     │
│  總成本 = 手續費 + Spread + 衝擊    │
│                                     │
│  Spread 存在原因：                  │
│  1. 逆向選擇（最重要）              │
│  2. 存貨風險                        │
│  3. 訂單處理成本                    │
│                                     │
│  限價 vs 市價：                     │
│  - 不急 → 限價單                    │
│  - 緊急 → 市價單                    │
│  - 低流動性 → 必須限價單            │
│                                     │
│  流動性檢查：先看再交易             │
│                                     │
│  淨 Edge > 交易成本 才值得做        │
└─────────────────────────────────────┘
```
