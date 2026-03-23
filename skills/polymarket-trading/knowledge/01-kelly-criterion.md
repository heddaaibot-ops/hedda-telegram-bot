# Kelly Criterion 深度指南

## 來源
- **Edward Thorp**《Beat the Dealer》《Beat the Market》
- **William Poundstone**《Fortune's Formula》

---

## 核心公式

### 基本形式
```
f* = (bp - q) / b
```

**變數說明**：
- `f*` = 最優倉位比例（Kelly fraction）
- `b` = 賠率（淨收益/投入，不含本金）
- `p` = 獲勝概率
- `q` = 失敗概率（= 1 - p）

### 另一種形式
```
f* = p - (q / b)
f* = p - (1-p) / b
```

### 二元賠率形式
當賠率 = 1:1 時（贏輸相同）：
```
f* = 2p - 1
```

---

## Polymarket 專用公式

### 買 YES
```
市場價格 = YES_price
你的估計 = your_prob

賠率 b = (1 / YES_price) - 1

f* = (b × your_prob - (1 - your_prob)) / b
```

### 買 NO
```
NO_price = 1 - YES_price
NO_prob = 1 - your_prob

賠率 b = (1 / NO_price) - 1

f* = (b × NO_prob - (1 - NO_prob)) / b
```

---

## 關鍵規則

### 1. 永遠不超過 Kelly

| 倍數 | 長期效果 |
|------|----------|
| 0.5x Kelly | 75% 的增長率，50% 的波動 |
| 1x Kelly | 最大增長率 |
| 2x Kelly | **零增長**（波動完全抵消收益）|
| 3x Kelly | **破產** |

> **數學證明**：超過 Kelly 的倉位，波動帶來的幾何損失超過期望收益。

### 2. 分數 Kelly 實踐

**建議使用 0.25x - 0.5x Kelly**，原因：
- 概率估計有誤差
- 減少波動，提高 Sharpe
- 心理更能承受

**分數 Kelly 對照表**：

| 分數 | 增長率保留 | 波動降低 | 建議場景 |
|------|-----------|---------|---------|
| 0.25x | 44% | 75% | 不確定性高 |
| 0.5x | 75% | 50% | 標準使用 |
| 0.75x | 94% | 25% | 高信心 |
| 1.0x | 100% | 0% | 僅理論 |

### 3. Edge 要求

**只在有明確 Edge 時交易**：
```
Edge = |你的估計 - 市場價格|

最小 Edge 門檻：5%
舒適 Edge 門檻：10%+
```

沒有 Edge = 沒有交易。

---

## 實戰計算範例

### 範例 1：買 YES
```
市場：某候選人會贏嗎？
YES 價格：40¢
你的估計：60%

計算：
b = (1/0.4) - 1 = 1.5
f* = (1.5 × 0.6 - 0.4) / 1.5
f* = (0.9 - 0.4) / 1.5
f* = 0.333 (33.3%)

半 Kelly：16.7%
1/4 Kelly：8.3%
```

### 範例 2：買 NO
```
市場：某法案會通過嗎？
YES 價格：70¢
你的估計：40%（你認為不會通過）

轉換為買 NO：
NO 價格：30¢
NO 概率：60%

b = (1/0.3) - 1 = 2.33
f* = (2.33 × 0.6 - 0.4) / 2.33
f* = (1.4 - 0.4) / 2.33
f* = 0.43 (43%)

半 Kelly：21.5%
```

### 範例 3：Edge 太小不交易
```
市場：比特幣會破 10 萬嗎？
YES 價格：55¢
你的估計：58%

Edge = |58% - 55%| = 3%

結論：Edge < 5%，不交易
```

---

## 進階：多市場 Kelly

### 獨立市場
如果多個市場**完全獨立**，可以各自計算 Kelly，但要注意：
- 總倉位不應超過 100%
- 相關性會降低有效 edge

### 相關市場
如果市場有**相關性**（如同一事件的不同問題）：
- 需要用更保守的 Kelly
- 考慮共同風險因素
- 作為一個 portfolio 管理

---

## 常見錯誤

### ❌ 錯誤 1：高估自己的概率準確度
**問題**：用 60% 估計去計算，但實際能力只有 55%
**解決**：用分數 Kelly 保護自己

### ❌ 錯誤 2：忽略交易成本
**問題**：spread 和手續費會吃掉 edge
**解決**：從 edge 中扣除成本再計算

### ❌ 錯誤 3：在小樣本後調整策略
**問題**：3 次輸了 2 次就改策略
**解決**：相信長期數學，短期波動是正常的

### ❌ 錯誤 4：沒有重新評估
**問題**：新信息出現後沒有調整倉位
**解決**：每次新信息 → 重算概率 → 重算 Kelly

---

## Python 實現

```python
def kelly_criterion(odds: float, win_prob: float) -> float:
    """
    基本 Kelly 公式

    Args:
        odds: 賠率（淨收益/投入）
        win_prob: 獲勝概率 (0-1)

    Returns:
        最優倉位比例
    """
    q = 1 - win_prob
    kelly = (odds * win_prob - q) / odds
    return max(0, kelly)


def polymarket_kelly(
    market_price: float,
    your_prob: float,
    fraction: float = 0.5
) -> dict:
    """
    Polymarket 專用 Kelly 計算

    Args:
        market_price: YES 價格 (0-1)
        your_prob: 你估計 YES 的概率 (0-1)
        fraction: Kelly 分數 (建議 0.25-0.5)

    Returns:
        建議交易
    """
    edge = your_prob - market_price

    if abs(edge) < 0.05:
        return {
            "action": "NO TRADE",
            "reason": "Edge too small",
            "edge": edge,
            "kelly": 0
        }

    if edge > 0:  # 買 YES
        odds = (1 / market_price) - 1
        kelly = (odds * your_prob - (1 - your_prob)) / odds
        return {
            "action": "BUY YES",
            "edge": edge,
            "full_kelly": kelly,
            "recommended": kelly * fraction,
            "confidence": "high" if edge > 0.15 else "medium"
        }

    else:  # 買 NO
        no_price = 1 - market_price
        no_prob = 1 - your_prob
        odds = (1 / no_price) - 1
        kelly = (odds * no_prob - (1 - no_prob)) / odds
        return {
            "action": "BUY NO",
            "edge": abs(edge),
            "full_kelly": kelly,
            "recommended": kelly * fraction,
            "confidence": "high" if abs(edge) > 0.15 else "medium"
        }


# 使用範例
result = polymarket_kelly(
    market_price=0.40,  # YES 賣 40¢
    your_prob=0.60,     # 你認為 60%
    fraction=0.5        # 半 Kelly
)
print(result)
# {'action': 'BUY YES', 'edge': 0.2, 'full_kelly': 0.333, 'recommended': 0.167, 'confidence': 'high'}
```

---

## 記憶卡

```
┌─────────────────────────────────────┐
│  Kelly 公式：f* = (bp - q) / b      │
│                                     │
│  🔴 2x Kelly = 零增長              │
│  💀 3x Kelly = 破產                │
│  ✅ 0.5x Kelly = 甜蜜點            │
│                                     │
│  最小 Edge：5%                      │
│  舒適 Edge：10%+                    │
│                                     │
│  生存 > 收益                        │
└─────────────────────────────────────┘
```
