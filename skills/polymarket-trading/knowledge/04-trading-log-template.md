# 交易紀錄系統與校準分析

## 來源
- **Philip Tetlock**《Superforecasting》— Brier Score 與校準方法
- **Annie Duke**《Thinking in Bets》— 決策日誌框架
- **Nate Silver**《The Signal and the Noise》— 預測追蹤

---

## 為什麼要記錄交易

> **「如果你不追蹤你的預測，你就無法知道你有多準確，也無法改進。」**
> — Philip Tetlock

**不記錄的後果**：
- 後見之明偏誤會重寫你的記憶
- 無法識別系統性錯誤
- 無法區分技術和運氣
- Resulting 會影響你的判斷

**記錄的好處**：
- 強制你量化信念
- 建立校準數據
- 識別偏誤模式
- 證明你的 edge（或暴露你沒有 edge）

---

## 單筆交易記錄模板

### 基本模板

```markdown
# 交易記錄 #___

## 基本信息
- **日期**：YYYY-MM-DD
- **市場**：[市場名稱/連結]
- **到期日**：YYYY-MM-DD
- **類別**：政治 / 體育 / 加密 / 經濟 / 其他

## 決策前（結果出來前填寫）

### 市場分析
- **當前市場價格**：YES = ___¢ / NO = ___¢
- **Spread**：___¢
- **24h 交易量**：$___
- **流動性評級**：A / B / C

### 我的分析

#### Step 1: Base Rate
- 參考類別：
- 歷史 Base Rate：____%
- 來源：

#### Step 2: 具體因素調整
調高因素：
- [ ] __________ (+___%)
- [ ] __________ (+___%)

調低因素：
- [ ] __________ (-___%)
- [ ] __________ (-___%)

#### Step 3: 最終估計
- **我的概率估計**：____%
- **信心區間**：___% - ___%
- **信心等級**：低 / 中 / 高

### Edge 計算
- **Edge** = |我的估計 - 市場價格| = ____%
- **方向**：BUY YES / BUY NO
- **Full Kelly**：____%
- **建議倉位**（0.5x Kelly）：____%

### 交易決策
- **動作**：買入 YES / 買入 NO / 不交易
- **實際倉位**：$___ (占總資金 ___%)
- **執行價格**：___¢
- **訂單類型**：限價單 / 市價單

### 決策理由（3 條核心理由）
1.
2.
3.

### 我可能錯的原因
1.
2.

### 更新觸發條件
如果發生以下情況，需要重新評估：
-
-

---

## 決策後（結果出來後填寫）

### 結果
- **實際結果**：YES / NO
- **結算價格**：___¢
- **盈虧**：+/- $___

### Brier Score 計算
```
Brier Score = (我的預測概率 - 實際結果)²

我的預測：____%（= 0.___）
實際結果：1（發生）/ 0（沒發生）

Brier = (0.___ - ___)² = ___
```

### 決策品質評估（獨立於結果）

#### Resulting 檢查
- [ ] 我是用結果還是過程來評估這筆交易？
- [ ] 如果重來 100 次，我會做同樣的決定嗎？

#### 過程評估
| 問題 | 是/否 | 備註 |
|------|-------|------|
| 我的分析在當時是合理的嗎？ | | |
| 我用了 Outside-In 方法嗎？ | | |
| 我主動找了反對證據嗎？ | | |
| 倉位符合 Kelly 原則嗎？ | | |
| 有什麼信息我忽略了？ | | |

#### 技術 vs 運氣分析
- 這個結果有多少是我能控制的？（0-100%）：____%
- 這個結果有多少是運氣？：____%
- 分析：

### 學到的教訓
-

---

## 元數據（系統自動計算）
- **持有天數**：___
- **預測準確度**：正確 / 錯誤
- **方向正確**：是 / 否
- **ROI**：+/-____%
```

---

## Brier Score 詳解

### 公式

```
Brier Score = (預測概率 - 實際結果)²

其中：
- 預測概率：0 到 1 之間
- 實際結果：1（發生）或 0（沒發生）
```

### 解讀標準

| Brier Score | 等級 | 描述 |
|-------------|------|------|
| 0.00 | 完美 | 只有預測 100% 且結果符合才能達到 |
| 0.00-0.10 | 優秀 | 專業預測者水平 |
| 0.10-0.15 | 良好 | 超級預測者水平（Tetlock 研究的前 2%）|
| 0.15-0.20 | 中等 | 有一定預測能力 |
| 0.20-0.25 | 及格邊緣 | 略好於隨機 |
| 0.25 | 隨機 | 相當於每次都猜 50% |
| > 0.25 | 不及格 | 比隨機還差，有系統性錯誤 |

### 計算範例

**範例 1：預測準確**
```
你的預測：70% YES
結果：YES 發生

Brier = (0.70 - 1)² = 0.09 ✅ 優秀
```

**範例 2：預測錯誤但校準良好**
```
你的預測：30% YES
結果：YES 發生

Brier = (0.30 - 1)² = 0.49 ❌ 這次很差

但如果你給 30% 的 10 個預測中有 3 個發生：
平均 Brier ≈ 0.21（尚可）
```

**範例 3：過度自信**
```
你的預測：90% YES
結果：NO

Brier = (0.90 - 0)² = 0.81 ❌ 非常差
```

### Python 計算工具

```python
def calculate_brier_score(predictions: list[tuple[float, int]]) -> dict:
    """
    計算 Brier Score

    Args:
        predictions: [(預測概率, 實際結果), ...]
                    預測概率: 0-1
                    實際結果: 0 或 1

    Returns:
        Brier score 分析
    """
    if not predictions:
        return {"error": "No predictions"}

    individual_scores = []
    for pred, actual in predictions:
        score = (pred - actual) ** 2
        individual_scores.append({
            "prediction": pred,
            "actual": actual,
            "brier": score
        })

    avg_brier = sum(s["brier"] for s in individual_scores) / len(individual_scores)

    # 評級
    if avg_brier < 0.10:
        rating = "優秀"
    elif avg_brier < 0.15:
        rating = "良好（超級預測者水平）"
    elif avg_brier < 0.20:
        rating = "中等"
    elif avg_brier < 0.25:
        rating = "及格邊緣"
    else:
        rating = "需要改進"

    return {
        "individual_scores": individual_scores,
        "average_brier": round(avg_brier, 4),
        "rating": rating,
        "total_predictions": len(predictions),
        "benchmark": "隨機猜測 = 0.25"
    }


# 使用範例
predictions = [
    (0.70, 1),  # 預測 70%，發生了
    (0.80, 1),  # 預測 80%，發生了
    (0.30, 0),  # 預測 30%，沒發生
    (0.60, 0),  # 預測 60%，沒發生（錯了）
]

result = calculate_brier_score(predictions)
print(f"平均 Brier Score: {result['average_brier']}")
print(f"評級: {result['rating']}")
```

---

## 校準分析框架

### 校準的定義

**良好校準** = 當你說 70% 時，事情真的有 70% 發生

```
校準圖（理想狀態 = 對角線）：

實際發生率
100%|                    *
 90%|                  *
 80%|                *
 70%|              *
 60%|            *
 50%|          *
 40%|        *
 30%|      *
 20%|    *
 10%|  *
    +------------------------
     10% 30% 50% 70% 90% 100%
         你的預測概率
```

### 校準分析模板

```markdown
# 校準分析報告

## 期間：YYYY-MM-DD 到 YYYY-MM-DD
## 總預測數：___

### 按概率區間分析

| 預測區間 | 預測次數 | 實際發生次數 | 實際發生率 | 理想發生率 | 偏差 |
|----------|----------|--------------|------------|------------|------|
| 0-10%    |          |              |            | 5%         |      |
| 10-20%   |          |              |            | 15%        |      |
| 20-30%   |          |              |            | 25%        |      |
| 30-40%   |          |              |            | 35%        |      |
| 40-50%   |          |              |            | 45%        |      |
| 50-60%   |          |              |            | 55%        |      |
| 60-70%   |          |              |            | 65%        |      |
| 70-80%   |          |              |            | 75%        |      |
| 80-90%   |          |              |            | 85%        |      |
| 90-100%  |          |              |            | 95%        |      |

### 發現

#### 過度自信檢測
- 高概率預測（>70%）的實際發生率：____%
- 如果 < 70%：你過度自信了

#### 過度保守檢測
- 低概率預測（<30%）的實際發生率：____%
- 如果 > 30%：你過度保守了

### 校準調整建議

如果過度自信：
- 把你認為的 90% 說成 ____%
- 把你認為的 70% 說成 ____%

如果過度保守：
- 把你認為的 60% 說成 ____%
- 把你認為的 30% 說成 ____%
```

### Python 校準分析工具

```python
def calibration_analysis(predictions: list[tuple[float, int]]) -> dict:
    """
    校準分析

    Args:
        predictions: [(預測概率, 實際結果), ...]

    Returns:
        校準分析報告
    """
    # 按區間分組
    bins = [
        (0.0, 0.2),
        (0.2, 0.4),
        (0.4, 0.6),
        (0.6, 0.8),
        (0.8, 1.0)
    ]

    bin_data = {f"{int(b[0]*100)}-{int(b[1]*100)}%": {"predictions": [], "outcomes": []}
                for b in bins}

    for pred, outcome in predictions:
        for low, high in bins:
            if low <= pred < high or (high == 1.0 and pred == 1.0):
                bin_name = f"{int(low*100)}-{int(high*100)}%"
                bin_data[bin_name]["predictions"].append(pred)
                bin_data[bin_name]["outcomes"].append(outcome)
                break

    analysis = {}
    for bin_name, data in bin_data.items():
        if data["predictions"]:
            avg_pred = sum(data["predictions"]) / len(data["predictions"])
            actual_rate = sum(data["outcomes"]) / len(data["outcomes"])
            analysis[bin_name] = {
                "count": len(data["predictions"]),
                "avg_prediction": round(avg_pred, 2),
                "actual_rate": round(actual_rate, 2),
                "deviation": round(actual_rate - avg_pred, 2)
            }

    # 判斷偏誤
    high_confidence = [p for p, o in predictions if p >= 0.7]
    high_conf_outcomes = [o for p, o in predictions if p >= 0.7]

    overconfident = False
    if high_confidence:
        expected = sum(high_confidence) / len(high_confidence)
        actual = sum(high_conf_outcomes) / len(high_conf_outcomes)
        overconfident = actual < expected - 0.1

    return {
        "bin_analysis": analysis,
        "overconfident": overconfident,
        "total_predictions": len(predictions),
        "recommendation": "減少高概率預測的信心度" if overconfident else "校準良好"
    }
```

---

## 週報模板

```markdown
# 週報：YYYY-MM-DD 至 YYYY-MM-DD

## 概覽
- **本週預測數**：___
- **結果出爐數**：___
- **平均 Brier Score**：___
- **勝率**：___% (___/___）
- **總盈虧**：+/- $___

## Brier Score 趨勢
| 週次 | Brier Score | 變化 |
|------|-------------|------|
| W-4  |             |      |
| W-3  |             |      |
| W-2  |             |      |
| W-1  |             |      |
| 本週 |             |      |

## 本週交易回顧

### 最佳決策（不論結果）
- 市場：
- 為什麼是好決策：

### 最差決策（不論結果）
- 市場：
- 為什麼是差決策：
- 如何改進：

### 運氣好的交易
- 市場：
- 為什麼是運氣：
- 警示：不要因此過度自信

### 運氣差的交易
- 市場：
- 為什麼是運氣：
- 應該：繼續這種決策過程

## 偏誤檢測

### 本週犯的偏誤
- [ ] Resulting
- [ ] 過度自信
- [ ] 確認偏誤
- [ ] 錨定效應
- [ ] 可得性偏誤
- [ ] 後見之明
- [ ] 沉沒成本

### 具體案例
-

## 下週計劃
1.
2.
3.

## 改進承諾
-
```

---

## 月報模板

```markdown
# 月報：YYYY年M月

## 績效摘要

### 數量指標
| 指標 | 本月 | 上月 | 變化 |
|------|------|------|------|
| 總預測數 | | | |
| 結果出爐數 | | | |
| 活躍市場數 | | | |

### 質量指標
| 指標 | 本月 | 上月 | 目標 | 達標？ |
|------|------|------|------|--------|
| 平均 Brier Score | | | <0.15 | |
| 校準誤差 | | | <5% | |
| Edge 實現率 | | | >50% | |

### 財務指標
| 指標 | 金額 |
|------|------|
| 期初資金 | $ |
| 總投入 | $ |
| 總收益 | $ |
| 期末資金 | $ |
| 月 ROI | % |

## 校準分析

### 分區表現
[插入校準分析表格]

### 發現
- 過度自信：是/否
- 過度保守：是/否
- 需要調整的區間：

## 按類別分析

| 類別 | 預測數 | Brier Score | 盈虧 | 評估 |
|------|--------|-------------|------|------|
| 政治 | | | | |
| 體育 | | | | |
| 加密 | | | | |
| 經濟 | | | | |
| 其他 | | | | |

### 強項
-

### 弱項（考慮減少）
-

## 偏誤審計

### 本月偏誤統計
| 偏誤類型 | 發生次數 | 改進中？ |
|----------|----------|----------|
| Resulting | | |
| 過度自信 | | |
| 確認偏誤 | | |
| 錨定效應 | | |
| 可得性偏誤 | | |
| 後見之明 | | |
| 沉沒成本 | | |

### 偏誤案例學習
**案例 1**：
- 發生了什麼：
- 應該怎麼做：
- 下次如何避免：

## 教訓總結

### 新學到的
1.
2.

### 需要強化的
1.
2.

### 要停止的習慣
1.

### 要開始的習慣
1.

## 下月計劃

### 目標
1. Brier Score < ___
2. 避免 ___ 偏誤
3. 專注於 ___ 類別

### 具體行動
1.
2.
3.
```

---

## 季度回顧框架

```markdown
# 季度回顧：YYYY Q_

## 整體表現

### 關鍵指標趨勢
| 月份 | 預測數 | Brier | ROI |
|------|--------|-------|-----|
| M1   |        |       |     |
| M2   |        |       |     |
| M3   |        |       |     |

### 校準演進
[校準圖對比]

## 能力圈分析

### 我最擅長的
- 類別：
- 證據：

### 我應該避免的
- 類別：
- 原因：

## 系統改進

### 本季做的調整
1.
2.

### 調整的效果
1.
2.

### 下季計劃調整
1.
2.

## 長期思考

### 我的 edge 來源是什麼？
-

### 這個 edge 可持續嗎？
-

### 如何擴大 edge？
-
```

---

## 快速記錄格式

**日常快速記錄**（最小版本）：

```
日期 | 市場 | 我的估計 | 市場價 | 動作 | 倉位 | 結果 | Brier
-----|------|----------|--------|------|------|------|------
     |      |          |        |      |      |      |
```

**Excel/Sheets 推薦欄位**：
1. 日期
2. 市場名稱
3. 市場連結
4. 我的預測概率
5. 市場價格
6. Edge
7. 動作（YES/NO/PASS）
8. 倉位金額
9. 倉位比例
10. 實際結果（1/0）
11. Brier Score
12. 盈虧
13. 備註

---

## 記憶卡

```
┌─────────────────────────────────────────────┐
│  交易記錄核心：                              │
│                                             │
│  📝 結果前記錄：不能改                       │
│  📊 Brier Score：目標 < 0.15                │
│  📈 校準分析：每月一次                       │
│                                             │
│  記錄什麼：                                  │
│  1. 你的預測概率                            │
│  2. 你的理由（3 條）                        │
│  3. 你可能錯的原因                          │
│  4. 結果和 Brier                            │
│  5. 過程評估（獨立於結果）                  │
│                                             │
│  不記錄 = 無法改進                          │
│  改進 = 複利積累                            │
└─────────────────────────────────────────────┘
```

---

*Created by Lil Pig 🐽 for Hedda 姐姐*
*Based on Tetlock's calibration methods and Duke's decision journal framework*
