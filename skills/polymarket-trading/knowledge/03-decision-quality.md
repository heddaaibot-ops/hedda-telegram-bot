# 決策品質框架

## 來源
- **Annie Duke**《Thinking in Bets: Making Smarter Decisions When You Don't Have All the Facts》

---

## 核心論點

### 1. Resulting 偏誤：決策品質的最大敵人

**定義**：將決策品質等同於結果品質的傾向。

```
❌ 結果好 → 認為決策好
❌ 結果差 → 認為決策差

✅ 好決策可能導致壞結果（運氣差）
✅ 壞決策可能導致好結果（運氣好）
```

**Polymarket 實例**：
```
場景：你估計某事件概率 70%，市場價格 50%
你買了 YES，結果事件沒發生

❌ Resulting 思維："我判斷錯了，不該買"
✅ 正確思維："如果我的 70% 估計是對的，長期這樣做是賺錢的"
```

### 2. 生活是撲克，不是西洋棋

| 西洋棋 | 撲克 | 現實世界 |
|--------|------|----------|
| 完全信息 | 不完全信息 | 不完全信息 |
| 確定性 | 概率性 | 概率性 |
| 技術決定結果 | 技術 + 運氣 | 技術 + 運氣 |
| 輸了 = 犯錯 | 輸了 ≠ 一定犯錯 | 輸了 ≠ 一定犯錯 |

> **「我可以做出最聰明、最謹慎的決策，它仍然可能炸在我臉上。」** — Annie Duke

### 3. 每個決策都是一個賭注

**框架**：把每個決定看作對未來不確定性的賭注

- 你押注的是你對現實的信念
- 你的籌碼是時間、金錢、機會成本
- 結果有概率分布，不是確定的

**思考方式轉變**：
```
舊思維："這個選擇是對是錯？"
新思維："這個選擇在給定信息下的期望值是多少？"
```

### 4. 技術 vs 運氣的分離

**事後分析框架**（Outcome Fielding）：

```
┌─────────────────────────────────────┐
│         分析每個結果               │
├─────────────────────────────────────┤
│  1. 這個結果有多少是我能控制的？   │
│     → 技術部分                      │
│                                     │
│  2. 這個結果有多少是我不能控制的？ │
│     → 運氣部分                      │
│                                     │
│  3. 只從技術部分學習和改進         │
└─────────────────────────────────────┘
```

### 5. 信念是概率，不是二元

**Duke 的建議**：用概率表達所有信念

```
❌ "我確定這會發生"
✅ "我 80% 確信這會發生"

❌ "這不可能"
✅ "這發生的概率約 5%"
```

**好處**：
- 迫使你量化不確定性
- 讓更新信念變得自然
- 避免全有或全無的思維

---

## 實用框架

### 決策評估矩陣

```
                   結果
              好        壞
        ┌─────────┬─────────┐
      好│ 值得慶祝 │ 壞運氣  │
決策    │         │ 繼續執行 │
        ├─────────┼─────────┤
      壞│ 好運氣  │ 應該改進 │
        │ 不要重複 │         │
        └─────────┴─────────┘
```

### 決策品質檢查清單

**做決策前**：
- [ ] 我有多確信？（用概率）
- [ ] 我考慮了哪些可能的結果？
- [ ] 每個結果的概率是多少？
- [ ] 我的信息來源可靠嗎？
- [ ] 有什麼我可能遺漏的？

**做決策後**：
- [ ] 結果是因為技術還是運氣？
- [ ] 我的過程有什麼可改進的？
- [ ] 如果再來一次，我會做同樣的決定嗎？

### Truth-Seeking 決策小組

**Duke 的建議**：建立「求真小組」

**組成**：至少 3 人（兩人爭論，一人仲裁）

**規則**：
1. 目標是「準確」，不是「證明自己對」
2. 鼓勵挑戰彼此的假設
3. 獎勵改變想法的人
4. 禁止 resulting（不以結果評判決策）

**實踐**：
- 分享決策和理由（不是結果）
- 讓他人挑戰你的推理
- 定期回顧決策品質

---

## Polymarket 應用

### 1. 分離預測品質和交易結果

```python
def evaluate_trade(my_prob, market_prob, result):
    """
    評估交易品質，分離運氣和技術
    """
    # 預測品質（技術）
    prediction_quality = {
        "my_probability": my_prob,
        "market_probability": market_prob,
        "edge": abs(my_prob - market_prob),
        "direction_correct": (my_prob > market_prob) == (result == 1)
    }

    # 結果分析
    if result == 1:  # 事件發生
        expected_given_my_prob = my_prob
    else:  # 事件沒發生
        expected_given_my_prob = 1 - my_prob

    # 判斷是技術還是運氣
    analysis = {
        "result": "WIN" if prediction_quality["direction_correct"] else "LOSS",
        "likely_skill": expected_given_my_prob > 0.6,  # 如果概率 > 60%，更可能是技術
        "likely_luck": expected_given_my_prob < 0.6,   # 如果概率 < 60%，更可能是運氣
    }

    return prediction_quality, analysis
```

### 2. 建立決策日誌

```markdown
## 交易日誌模板

### 市場：[市場名稱]
### 日期：[日期]

#### 決策前
- 市場價格：___¢
- 我的估計：___%
- 信心等級：低/中/高
- 主要理由：
  1.
  2.
  3.

#### 決策
- 動作：買 YES / 買 NO / 不交易
- 倉位大小：___%
- Kelly 計算：___

#### 決策後（無論結果）
- 結果：發生 / 沒發生
- 我的估計準確嗎？
- 過程有什麼可改進的？
- 這是技術還是運氣？

#### 學到的教訓
-
```

### 3. 避免 Resulting 的實踐

**每週回顧時**：
1. 把所有交易按「過程品質」分類，不是結果
2. 識別「好過程壞結果」的交易 — 這些是你應該繼續做的
3. 識別「壞過程好結果」的交易 — 這些是你應該停止做的

**心理技巧**：
- 想像你做了 100 次同樣的決定
- 關注長期期望值，不是單次結果
- 慶祝好的決策過程，不是好的結果

---

## 關鍵引言

> **「Life is poker, not chess. We can't always know the cause of a particular outcome: skill, luck, or some blend of both.」**
> — Annie Duke

> **「What makes a decision great is not that it has a great outcome. A great decision is the result of a good process.」**
> — Annie Duke

> **「Thinking in bets starts with recognizing that there are exactly two things that determine how our lives turn out: the quality of our decisions and luck.」**
> — Annie Duke

> **「When we work backward from results to figure out why those things happened, we are susceptible to a variety of cognitive traps.」**
> — Annie Duke

> **「The best poker players learn quickly that one of the most important things to do is to separate the quality of their decision from the quality of the result.」**
> — Annie Duke

---

## 常見錯誤

### 1. 因為輸了就改變策略
**問題**：連輸 3 次就認為策略有問題
**現實**：如果你的 edge 是 55%，連輸 3 次的概率是 9%（完全正常）
**解決**：只在發現過程錯誤時改變策略

### 2. 因為贏了就過度自信
**問題**：連贏 3 次就加大倉位
**現實**：可能只是運氣好
**解決**：堅持 Kelly 計算，不因短期結果調整

### 3. 忽略反面證據
**問題**：只關注支持自己觀點的信息
**解決**：主動尋找「如果我錯了，會看到什麼？」

### 4. 過度從單一事件學習
**問題**：一次大輸就徹底改變方法
**解決**：需要足夠樣本才能得出可靠結論

---

## 記憶卡

```
┌─────────────────────────────────────┐
│  Resulting 偏誤：                   │
│  好結果 ≠ 好決策                    │
│  壞結果 ≠ 壞決策                    │
│                                     │
│  決策品質檢查：                     │
│  1. 信息充分嗎？                    │
│  2. 考慮了所有可能嗎？              │
│  3. 概率估計合理嗎？                │
│  4. 過程可重複嗎？                  │
│                                     │
│  事後分析：                         │
│  技術 vs 運氣，只從技術學習         │
│                                     │
│  過程 > 結果                        │
└─────────────────────────────────────┘
```
