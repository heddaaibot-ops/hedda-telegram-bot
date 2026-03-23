# 🚨 Critical Fixes Required - 完整修復指南

> **發送給用戶**: 這份文檔包含所有需要修改的地方，讓 bot 能在任何系統上運行

---

## 📋 問題總結

你的代碼中有 **3 處硬編碼路徑**，導致在其他系統上運行時崩潰：

| 位置 | 問題 | 嚴重性 | 影響 |
|------|------|--------|------|
| `src/session.ts:254` | 硬編碼 MEMORY.md 路徑 | 🔴 高 | 每 10 條消息會注入錯誤路徑 |
| `src/index.ts:104-113` | 硬編碼 memory 文件列表 | 🟡 中 | 啟動時顯示無用信息 |
| `src/session.ts:237` | 已修復 ✅ | - | v1.0.1 已解決 |

---

## 🔧 修復方案

### ✅ 方法 1：拉取最新代碼（推薦）

最簡單的方法，從 GitHub 拉取：

```bash
cd hedda-telegram-bot
git pull origin main
```

**注意**: 這只會獲得 v1.0.1 的修復（修復了 src/session.ts:237），但還有兩處需要手動修改！

---

### 🛠️ 方法 2：手動修改（完整修復）

#### 修復 1: `src/session.ts` 第 254 行

**位置**: `src/session.ts` 第 251-256 行

**找到這段代碼**:
```typescript
    } else if (this.messageCount % 10 === 0 && this.messageCount > 0) {
      // Every 10 messages in a resumed session, remind to check MEMORY.md for important context
      // This helps recover from context truncation
      const contextReminder = `[提醒：這是一個繼續中的對話。如果你覺得遺漏了重要資訊，請快速查看 /Users/heddaai/clawd/piggyx/MEMORY.md 確認關鍵內容。]\n\n`;
      messageToSend = contextReminder + message;
    }
```

**替換為**:
```typescript
    } else if (this.messageCount % 10 === 0 && this.messageCount > 0) {
      // Every 10 messages in a resumed session, optionally remind to check MEMORY.md
      let contextReminder = "";
      const memoryPath = process.env.MEMORY_FILE_PATH;
      if (memoryPath) {
        contextReminder = `[Reminder: This is an ongoing conversation. If you feel you're missing important context, please check ${memoryPath} for key information.]\n\n`;
      }
      messageToSend = contextReminder + message;
    }
```

**改動說明**:
- ❌ 移除硬編碼路徑 `/Users/heddaai/clawd/piggyx/MEMORY.md`
- ✅ 改為讀取環境變量 `MEMORY_FILE_PATH`
- ✅ 如果沒有設置環境變量，則不顯示提醒（不會崩潰）

---

#### 修復 2: `src/index.ts` 第 102-124 行

**位置**: `src/index.ts` 第 102-124 行

**找到這段代碼**:
```typescript
// Auto-load memory on startup
try {
  const memoryFiles = [
    "/Users/heddaai/clawd/piggyx/MEMORY.md",
    "/Users/heddaai/clawd/piggyx/inspiration_library.md",
    "/Users/heddaai/clawd/piggyx/polymarket_research.md",
    "/Users/heddaai/clawd/piggyx/polymarket_small_traders.md",
    "/Users/heddaai/clawd/piggyx/polymarket_tips_summary.md",
    "/Users/heddaai/clawd/piggyx/trading_strategy.md",
    "/Users/heddaai/clawd/kol-database.md",
    "/Users/heddaai/clawd/piggyx/telegram_topics.md",
  ];

  console.log("📖 Loading memory files...");
  for (const file of memoryFiles) {
    if (existsSync(file)) {
      console.log(`  ✓ ${file.split('/').pop()}`);
    }
  }
  console.log("✅ Memory loaded! Ready for Hedda 姐姐 🩵");
} catch (e) {
  console.warn("Memory load failed:", e);
}
```

**替換為**:
```typescript
// Check for memory configuration
try {
  const memoryPath = process.env.MEMORY_FILE_PATH;
  if (memoryPath && existsSync(memoryPath)) {
    console.log(`📖 Memory file configured: ${memoryPath}`);
    console.log("✅ Bot ready!");
  } else if (memoryPath) {
    console.warn(`⚠️  Memory file not found: ${memoryPath}`);
    console.log("✅ Bot ready (without memory)");
  } else {
    console.log("ℹ️  No memory file configured (set MEMORY_FILE_PATH to enable)");
    console.log("✅ Bot ready!");
  }
} catch (e) {
  console.warn("Memory check failed:", e);
  console.log("✅ Bot ready!");
}
```

**改動說明**:
- ❌ 移除所有硬編碼的 memory 文件路徑
- ✅ 改為檢查環境變量 `MEMORY_FILE_PATH`
- ✅ 提供清晰的狀態信息（有/無 memory 配置）
- ✅ 移除 "Ready for Hedda 姐姐 🩵" 這種個人化信息

---

## 📝 完整的修改後文件

為了確保不出錯，這裡提供完整的修改後的關鍵區塊：

### `src/session.ts` (完整的 memory loading 區塊)

**行號 218-256**，完整替換為：

```typescript
    // Inject current date/time and optional memory loading at session start
    let messageToSend = message;
    if (isNewSession) {
      const now = new Date();
      const datePrefix = `[Current date/time: ${now.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }
      )}]\n\n`;

      // Optional: Auto-load memory if MEMORY.md exists in project
      let memoryPrefix = "";
      const memoryPath = process.env.MEMORY_FILE_PATH;
      if (memoryPath) {
        try {
          // Check if file exists and is readable
          const memoryFile = Bun.file(memoryPath);
          if (await memoryFile.exists()) {
            memoryPrefix = `🧠 Loading memory...\n\nPlease read the core memory file at:\n${memoryPath}\n\nThen proceed with the following message:\n\n`;
          }
        } catch (error) {
          console.warn(`Memory file not accessible: ${memoryPath}`);
        }
      }

      messageToSend = datePrefix + memoryPrefix + message;
    } else if (this.messageCount % 10 === 0 && this.messageCount > 0) {
      // Every 10 messages in a resumed session, optionally remind to check MEMORY.md
      let contextReminder = "";
      const memoryPath = process.env.MEMORY_FILE_PATH;
      if (memoryPath) {
        contextReminder = `[Reminder: This is an ongoing conversation. If you feel you're missing important context, please check ${memoryPath} for key information.]\n\n`;
      }
      messageToSend = contextReminder + message;
    }
```

### `src/index.ts` (啟動時的 memory check)

**行號 102-124**，完整替換為：

```typescript
// Check for memory configuration
try {
  const memoryPath = process.env.MEMORY_FILE_PATH;
  if (memoryPath && existsSync(memoryPath)) {
    console.log(`📖 Memory file configured: ${memoryPath}`);
    console.log("✅ Bot ready!");
  } else if (memoryPath) {
    console.warn(`⚠️  Memory file not found: ${memoryPath}`);
    console.log("✅ Bot ready (without memory)");
  } else {
    console.log("ℹ️  No memory file configured (set MEMORY_FILE_PATH to enable)");
    console.log("✅ Bot ready!");
  }
} catch (e) {
  console.warn("Memory check failed:", e);
  console.log("✅ Bot ready!");
}
```

---

## 🧪 驗證修改

修改完成後，重啟 bot 並測試：

### 1. 停止舊進程
```bash
killall -9 bun
```

### 2. 重新啟動
```bash
cd hedda-telegram-bot
./start.sh
```

### 3. 測試消息

發送這些測試：

```
# 測試 1: 簡單消息（應該成功）
hi

# 測試 2: 工具使用（之前崩潰的）
install bird cli https://github.com/jawond/bird

# 測試 3: WebFetch 工具
search python documentation

# 測試 4: 文件操作
list files in current directory
```

所有測試都應該正常工作，不會崩潰！

---

## 📊 對比表：修改前 vs 修改後

| 特性 | 修改前 | 修改後 |
|------|--------|--------|
| 硬編碼路徑 | ❌ 3 處 | ✅ 0 處 |
| 跨系統兼容性 | ❌ 只能在原作者電腦運行 | ✅ 任何系統都可運行 |
| Memory 功能 | ❌ 強制要求特定路徑 | ✅ 可選，通過環境變量配置 |
| 錯誤提示 | ❌ 崩潰無提示 | ✅ 清晰的配置狀態信息 |
| 啟動信息 | ❌ 個人化信息 | ✅ 通用信息 |

---

## 🔍 為什麼會崩潰？

**技術原因**:

1. **路徑不存在** → `existsSync()` 返回 false
2. **Claude 嘗試讀取** → 安全檢查 `isPathAllowed()` 拒絕
3. **拋出異常** → `File access blocked: /Users/heddaai/clawd/piggyx/MEMORY.md`
4. **Claude Code 進程崩潰** → `exit code 1`

**觸發條件**:
- 新會話開始時（session.ts:237）✅ 已修復
- 每 10 條消息時（session.ts:254）❌ **仍需修復**
- 任何需要 memory 上下文的操作

---

## 🎯 額外建議

### 1. 添加到 README.md

在 README 的配置部分添加：

```markdown
### Memory 功能（可選）

如果你想讓 bot 在啟動時自動加載記憶文件：

1. 創建 memory 文件：
   ```bash
   cp memory/MEMORY.md.template memory/MEMORY.md
   ```

2. 編輯 memory/MEMORY.md，添加你的信息

3. 在 .env 中添加：
   ```bash
   MEMORY_FILE_PATH=./memory/MEMORY.md
   # 或使用絕對路徑：
   # MEMORY_FILE_PATH=/path/to/your/memory.md
   ```

4. 重啟 bot
```

### 2. 創建用戶友好的 memory 模板

在 `memory/MEMORY.md.template` 中添加示例：

```markdown
# 🧠 Bot Memory

> This file is loaded when the bot starts. Add important context here.

## 👤 User Info

- Name: [Your Name]
- Timezone: [e.g., GMT+8]
- Language: [e.g., English, 繁體中文]

## 🎯 Important Preferences

- Coding style: [e.g., TypeScript with types]
- Response detail: [e.g., concise, detailed]
- Confirmation needed: [Yes/No]

## 📝 Current Projects

### Project 1
- Name:
- Path:
- Status:

## 💡 Important Notes

- [Add any important context here]
```

---

## 🚀 部署到生產環境

修改完成並測試通過後：

```bash
# 1. 提交修改
git add src/session.ts src/index.ts
git commit -m "fix: Remove all hardcoded paths for cross-system compatibility"

# 2. 推送到 GitHub
git push origin main

# 3. 創建 release tag
git tag -a v1.0.2 -m "Fix all hardcoded paths"
git push origin v1.0.2
```

---

## 📞 需要幫助？

如果修改後仍有問題：

1. 檢查 bot-error.log：
   ```bash
   tail -50 bot-error.log
   ```

2. 檢查是否有其他硬編碼路徑：
   ```bash
   grep -r "/Users/heddaai" src/ --include="*.ts"
   ```

3. 驗證環境變量：
   ```bash
   echo $MEMORY_FILE_PATH
   ```

---

**修復優先級**: 🔴 **立即修復**

**預計時間**: 5-10 分鐘

**測試狀態**: ⏳ 待驗證

---

*Last updated: 2024-03-24 02:45 AM GMT+8*
*Created by: Piggyx for Hedda 姐姐 🩵*
