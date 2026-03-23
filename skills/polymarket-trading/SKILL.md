---
name: polymarket-trading
description: Polymarket 預測市場交易策略：整合 Kelly Criterion 倉位管理、概率校準框架、認知偏誤防禦，基於 Edward Thorp、Philip Tetlock、Charlie Munger 等大師智慧
user-invocable: true
---

# 🎯 Polymarket 交易策略系統

基於 Benn Huang 的 OpenClaw 書單，整合七位大師的核心智慧，專為預測市場設計的完整交易框架。

> **核心理念**：AI 的處理帶寬是無限的，所有靠讀數據能觸達的領域，都是 AI 的能力圈！

---

## 📚 七本經典 × 核心知識

### 1. Edward Thorp《Beat the Dealer》《Beat the Market》
**身份**：量化賭博/投資之父，Kelly Criterion 實戰應用者

**核心貢獻**：
```
Kelly 公式：f* = (bp - q) / b

其中：
- f* = 最優倉位比例
- b = 賠率（淨收益/投入）
- p = 獲勝概率
- q = 失敗概率 (1-p)
```

**實戰規則**：
- ✅ 使用**分數 Kelly**（如 0.5x Kelly）降低波動
- ✅ **永遠不超過 Kelly** — 這是數學定律
- ✅ 不確定時，用更保守的倉位

---

### 2. William Poundstone《Fortune's Formula》
**核心主題**：Kelly Criterion 的歷史、數學與故事

**關鍵洞察**：
| 倍數 | 結果 |
|------|------|
| 1x Kelly | 長期最優增長 |
| 2x Kelly | 零增長（波動抵消收益） |
| 3x Kelly | **破產** |

**黃金法則**：
> **生存 > 收益**
>
> 活著比贏更重要。永遠留在遊戲裡。

---

### 3. Philip Tetlock《Superforecasting》
**核心框架**：Outside-In 概率估計法

**三步流程**：
```
1️⃣ 找 Base Rate（基準率）
   "歷史上這類事件發生的頻率是多少？"

2️⃣ 具體因素調整
   "這次有什麼特殊情況？"

3️⃣ 貝葉斯更新
   "新信息出現後如何調整？"
```

**校準標準**：
- 🎯 目標 **Brier Score < 0.15**
- 📊 給**範圍**而非點估計
- 📝 記錄預測，定期校準

---

### 4. Nate Silver《The Signal and the Noise》
**核心概念**：區分信號與噪聲

**關鍵原則**：
- 🔊 **信號**：有預測價值的信息
- 🔇 **噪聲**：無意義的波動和干擾
- ⚖️ **過程 > 結果** — 好決策可能輸，爛決策可能贏

**實戰應用**：
- 不要過度擬合近期數據
- 關注長期趨勢而非短期波動
- 保持概率思維

---

### 5. Annie Duke《Thinking in Bets》
**核心概念**："Resulting" 偏誤

> **Resulting**：用結果判斷決策質量
>
> ❌ 錯誤問題："贏了嗎？"
> ✅ 正確問題："過程對不對？"

**認知偏誤防禦清單**：

| 偏誤 | 描述 | 防禦 |
|------|------|------|
| Resulting | 以結果論英雄 | 只評估決策過程 |
| 確認偏誤 | 只看支持觀點的信息 | 主動找反面證據 |
| 過度自信 | 高估自己的預測能力 | 用分數 Kelly |
| 錨定效應 | 被初始信息錨定 | 先寫下預測再看市場 |
| 沉沒成本 | 因已投入而不願退出 | 每天重新評估持倉 |

---

### 6. Larry Harris《Trading and Exchanges》
**核心主題**：市場微觀結構

**交易執行原則**：

```
💰 Spread 成本意識
   - 每次交易都有買賣價差成本
   - 頻繁交易 = 被 spread 吃掉收益

📋 限價單 vs 市價單
   - 限價單：等待成交，可能錯過
   - 市價單：立即成交，付出 spread

⚠️ Adverse Selection（逆向選擇）
   - 新聞發布前別掛限價單！
   - 知情交易者會吃掉你的單
```

**實戰規則**：
- 非緊急情況用限價單
- 重大消息前取消所有掛單
- 注意流動性和深度

---

### 7. Charlie Munger（窮查理寶典）
**核心哲學**：專注力 + 耐心

> **下重注當賠率有利，其餘時間什麼都不做。**

**Munger 精神實踐**：
- 研究 900 個市場，只下 4 筆交易
- 不是每個市場都要參與
- 等待顯而易見的機會

---

## 🧮 Kelly Criterion 計算器

### 基本公式
```python
def kelly_criterion(odds, win_prob):
    """
    計算 Kelly 倉位

    Args:
        odds: 賠率（如 Polymarket YES 價格 0.4 表示賠率 1.5）
        win_prob: 你估計的真實獲勝概率

    Returns:
        最優倉位比例
    """
    b = (1 / odds) - 1  # 將價格轉換為賠率
    p = win_prob
    q = 1 - p

    kelly = (b * p - q) / b
    return max(0, kelly)  # 不能是負數
```

### Polymarket 專用計算
```python
def polymarket_kelly(market_price, your_prob, fraction=0.5):
    """
    Polymarket Kelly 計算

    Args:
        market_price: 市場 YES 價格（0-1）
        your_prob: 你估計 YES 的概率（0-1）
        fraction: Kelly 分數（建議 0.25-0.5）

    Returns:
        dict: 建議倉位和方向
    """
    # 計算買 YES 的 Kelly
    if your_prob > market_price:
        odds = (1 / market_price) - 1
        kelly = ((odds * your_prob) - (1 - your_prob)) / odds
        return {
            "action": "BUY YES",
            "kelly": kelly * fraction,
            "edge": your_prob - market_price
        }

    # 計算買 NO 的 Kelly
    elif your_prob < market_price:
        no_price = 1 - market_price
        no_prob = 1 - your_prob
        odds = (1 / no_price) - 1
        kelly = ((odds * no_prob) - (1 - no_prob)) / odds
        return {
            "action": "BUY NO",
            "kelly": kelly * fraction,
            "edge": market_price - your_prob
        }

    else:
        return {"action": "NO TRADE", "kelly": 0, "edge": 0}
```

### 實例計算
```
市場價格：YES = 40¢
你的估計：60% 會發生

賠率 b = (1/0.4) - 1 = 1.5
Kelly f* = (1.5 × 0.6 - 0.4) / 1.5 = 0.33

→ 全 Kelly 建議：33% 倉位
→ 半 Kelly 建議：16.5% 倉位
→ 1/4 Kelly 建議：8.25% 倉位
```

---

## 📊 概率校準框架

### Outside-In 評估模板
```markdown
## 市場：[市場名稱]
## 當前價格：[XX]¢

### Step 1: Base Rate
- 歷史上類似事件的發生率：____%
- 參考案例：

### Step 2: 具體因素調整
調高因素：
-
-

調低因素：
-
-

### Step 3: 最終估計
- 我的概率估計：____%（範圍：___% - ___%）
- 與市場差異：±____%
- 信心水平：低/中/高

### Step 4: Kelly 計算
- Edge = |我的估計 - 市場價格| = ____%
- 建議方向：BUY YES / BUY NO / NO TRADE
- 半 Kelly 倉位：____%
```

### Brier Score 追蹤
```markdown
| 日期 | 市場 | 我的估計 | 實際結果 | Brier |
|------|------|----------|----------|-------|
|      |      |          |          |       |

Brier Score = (預測概率 - 實際結果)²
目標：平均 Brier < 0.15
```

---

## 🛡️ 風險管理規則

### 倉位限制
```
單一市場最大倉位：10%
相關市場總倉位：25%
總投入資金：不超過可承受虧損
```

### 止損紀律
```
❌ 不設固定止損（概率市場不同於股票）
✅ 根據新信息重新評估概率
✅ 如果概率估計改變，調整倉位
✅ 如果不再有 edge，退出
```

### 每日檢查清單
```markdown
[ ] 審視所有持倉
[ ] 檢查是否有新信息改變概率
[ ] 確認沒有超過倉位限制
[ ] 記錄任何新的預測
```

---

## 🎯 交易決策流程

```
┌─────────────────┐
│   發現機會      │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Outside-In 評估 │
│ (Base Rate →    │
│  調整 → 貝葉斯) │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Edge > 5%?      │──No──→ 不交易
└────────┬────────┘
         │Yes
         ↓
┌─────────────────┐
│ Kelly 計算      │
│ (使用 0.25-0.5x)│
└────────┬────────┘
         ↓
┌─────────────────┐
│ 風險檢查        │
│ (倉位限制、     │
│  相關性)        │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 執行交易        │
│ (限價單優先)    │
└─────────────────┘
```

---

## 📝 觸發方式

### 分析市場
- `/polymarket-trading 分析 [市場連結]`
- "幫我評估這個 Polymarket 市場"
- "用 Kelly 算一下這個市場的倉位"

### 概率校準
- "幫我做 Outside-In 分析"
- "計算這個預測的 Brier Score"

### 投資組合檢查
- "檢查我的 Polymarket 持倉"
- "今天有什麼市場機會？"

---

## 💡 核心記憶卡

```
┌────────────────────────────────────────┐
│  🧠 生存 > 收益                        │
│  📊 過程 > 結果                        │
│  🎯 Base Rate → 調整 → 貝葉斯          │
│  📐 永遠用分數 Kelly（0.25-0.5x）      │
│  ⏳ 等待賠率有利，其餘時間什麼都不做   │
│  ⚠️ 2x Kelly = 零增長，3x = 破產       │
└────────────────────────────────────────┘
```

---

## 📖 延伸閱讀

| 作者 | 書名 | 核心貢獻 |
|------|------|----------|
| Edward Thorp | Beat the Dealer / Beat the Market | Kelly 實戰 |
| William Poundstone | Fortune's Formula | Kelly 歷史與數學 |
| Philip Tetlock | Superforecasting | 概率校準框架 |
| Nate Silver | The Signal and the Noise | 信號 vs 噪聲 |
| Annie Duke | Thinking in Bets | 認知偏誤防禦 |
| Larry Harris | Trading and Exchanges | 市場微觀結構 |
| Charlie Munger | 窮查理寶典 | 專注與耐心 |

---

*Created by Lil Pig 🐽 for Hedda 姐姐*
*Based on @benn_huang's OpenClaw book list*
