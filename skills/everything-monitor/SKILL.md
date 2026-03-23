---
name: everything-monitor
description: "Monitor @trdEverything tweets and write Chinese copywriting for Discord. Use when: cron triggers Everything monitoring, user says '查 Everything', '監控推文', 'check Everything tweets', or when processing tweets from #everything-推文 channel."
---

# Everything 推文監控

監控 @trdEverything 推文，按風格指南寫中文文案，發送到 Discord #everything-推文 頻道。

## 觸發方式

- **Cron Job**：每 4 小時自動執行
- **手動觸發**：姐姐說「查 Everything」「監控推文」

## 完整流程

### Step 1: 查詢最新推文
```bash
bird user-tweets trdEverything -n 5
```

### Step 2: 比對是否有新推文
- 檢查長期記憶中的「最後處理的推文 ID」
- 已處理的推文列表在 MEMORY.md 的「Everything 推文監控」區塊
- 有新推文 → 繼續；沒有 → 結束

### Step 3: 讀取推文內容
從 bird 輸出取得：
- 推文 ID
- 推文文字內容
- 發布時間
- 原文連結：`https://x.com/trdEverything/status/{tweet_id}`

### Step 4: 按風格指南寫中文文案

#### 風格規則（強制）
- **語言**：簡體中文
- **語氣**：專業但不刻板，有洞察力
- **開頭**：固定加上 🎡 符號
- **術語**：Stage = 輪次，Phase = 階段
- **技術描述**：要具體，不空洞
- **保留專業術語**：不過度翻譯
- **結尾克制**：不要感嘆號堆疊

#### 禁止事項（紅線）
- ❌ **禁止促銷感表達**
- ❌ **禁止空洞的總結性套話**：「先發優勢不言而喻」「不言自明」「毋庸置疑」「顯而易見」
- ❌ **禁止使用 `-` 符號**（用 `·` 或其他替代）
- ❌ **禁止編造不確定的事實**：例「官方會參考」這種無法確認的說法

### Step 4.5: 延伸解讀（最重要！）

**不要只翻譯原文！必須加入延伸：**
- 解讀這條推文的意義（為什麼重要？對用戶有什麼影響？）
- 用活潑但專業的語氣（例：「穩穩賺還是 all in 派？」）
- 可以加入背景知識補充
- 讓讀者感受到價值，不是看翻譯機器人
- **但不要編造不確定的事實**

### Step 5: 組裝完整文案
```
🎡 [中文文案內容，含延伸解讀]

---
📎 原文：https://x.com/trdEverything/status/{tweet_id}
```

### Step 6: 發送到 Discord
```bash
openclaw message send \
  --channel discord \
  --account lilpig_discord \
  --target "1476103351795056681" \
  --message "[完整文案]"
```

Discord 頻道：#everything-推文（ID: 1476103351795056681）

### Step 7: 更新記憶
- 更新 MEMORY.md 中「最後處理的推文 ID」
- 將新 ID 加入已處理列表
- 避免重複處理

## 禁止事項（全局）

- ❌ 不要捏造推文連結
- ❌ 不要編造不存在的推文內容
- ❌ 如果 bird 查不到，就說「查不到」，不要假裝有
- ❌ 不要跳過延伸解讀只做翻譯

## 好的文案範例

```
🎡 Everything 第 8 輪次正式啟動！

這一輪新增了動態收益調整機制，根據市場波動自動
調節質押回報率。簡單說：行情好的時候收益更高，
行情差的時候風險更低。

對於已經在場的用戶，這基本上是「不用動手」的
升級。新用戶入場的話，現在的機制比前幾輪更友善。

穩穩賺還是 all in 派？每個人的策略不同，但至少
機制上給了更多靈活空間。

---
📎 原文：https://x.com/trdEverything/status/xxxxx
```

## 相關資源
- Twitter 帳號：@trdEverything
- Discord 頻道 ID：1476103351795056681
- 風格參考：本文件 Step 4 + Step 4.5
