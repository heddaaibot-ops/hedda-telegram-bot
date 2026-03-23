# 🐦 Twitter Smart Router

**版本：** v1.1.2
**作者：** Hedda & Piggyx
**用途：** 智能選擇最經濟的方式抓取 Twitter 內容

---

## 🎯 **這是什麼？**

Twitter Smart Router 是一個**智能路由系統**，會自動幫你選擇最便宜、最快的方式抓取 Twitter 內容：

1. **Bird CLI** — 免費，優先使用 ✅
2. **twitterapi.io** — 付費 API，Bird 失敗時使用
3. **Playwright** — 瀏覽器自動化，最後備援

---

## 🚀 **快速開始**

### **1. 確保有 Twitter Cookies**

```bash
# 如果還沒有 cookies，先執行：
hedda-extract-twitter-cookies
```

### **2. 直接使用**

```bash
cd /Users/heddaai/clawd/pimi-reports

# 抓取單條推文
node twitter-smart-router.js https://x.com/elonmusk/status/2026942204170940504

# 抓取用戶最新推文
node twitter-smart-router.js https://twitter.com/VitalikButerin

# 搜尋推文
node twitter-smart-router.js "https://x.com/search?q=bitcoin"
```

---

## 📖 **詳細用法**

### **基本命令**

```bash
node twitter-smart-router.js <twitter-url> [選項]
```

### **選項**

| 選項 | 說明 |
|------|------|
| `--verbose` 或 `-v` | 顯示詳細執行過程 |
| `--json` | 輸出 JSON 格式 |
| `--force <方案>` | 強制使用特定方案（bird / twitterapi / playwright） |
| `--help` | 顯示幫助訊息 |

---

## 🎯 **支援的 URL 類型**

| 類型 | 範例 | 優先方案 |
|------|------|----------|
| **單條推文** | `https://x.com/user/status/123` | Bird CLI (免費) |
| **X Article** | `https://x.com/i/web/status/123` | Bird CLI (唯一支援) |
| **用戶主頁** | `https://twitter.com/elonmusk` | twitterapi (完整數據) |
| **搜尋** | `https://x.com/search?q=bitcoin` | twitterapi (最穩定) |

---

## 💡 **使用範例**

### **範例 1：抓取單條推文**

```bash
node twitter-smart-router.js https://x.com/elonmusk/status/2026942204170940504
```

**輸出：**
```
✅ 方案：bird | 類型：tweet

──────────────────────────────────────────────────
@elonmusk (Elon Musk):
Much tunneling
📅 Thu Feb 26 08:47:34 +0000 2026
🔗 https://x.com/elonmusk/status/2026942204170940504
❤️ 20361  🔁 2265  💬 1786
──────────────────────────────────────────────────
```

---

### **範例 2：verbose 模式（顯示詳細過程）**

```bash
node twitter-smart-router.js https://x.com/elonmusk/status/123 --verbose
```

**輸出：**
```
🔍 解析 URL：https://x.com/elonmusk/status/123
📌 類型：tweet (ID: 123) (@elonmusk)

📋 策略順序：
   1. bird         — 單條推文，Bird CLI 免費最快
   2. twitterapi   — 備用，用 tweet ID 直接查
   3. playwright   — 最後備援

⚡ 嘗試 [bird]...
✅ [bird] 成功！
```

---

### **範例 3：強制使用特定方案**

```bash
# 強制使用 Bird CLI
node twitter-smart-router.js <url> --force bird

# 強制使用付費 API
node twitter-smart-router.js <url> --force twitterapi
```

---

### **範例 4：JSON 輸出**

```bash
node twitter-smart-router.js <url> --json
```

**適合用於：**
- 其他程式處理
- 自動化腳本
- API 整合

---

## 🔧 **在程式中使用**

### **方式一：基本使用**

```javascript
const { fetchTwitterUrl } = require('./twitter-smart-router');

const result = await fetchTwitterUrl('https://x.com/elonmusk/status/123');

if (result.success) {
  console.log(result.content);
  console.log('使用方案:', result.method);
} else {
  console.error('失敗:', result.error);
}
```

---

### **方式二：帶選項**

```javascript
const result = await fetchTwitterUrl('https://x.com/elonmusk/status/123', {
  verbose: true,           // 顯示詳細日誌
  forceMethod: 'bird'      // 強制使用 bird
});
```

---

### **方式三：批量抓取**

```javascript
const { fetchTwitterUrl } = require('./twitter-smart-router');

const urls = [
  'https://x.com/elonmusk/status/123',
  'https://x.com/VitalikButerin/status/456',
  'https://x.com/cz_binance/status/789'
];

for (const url of urls) {
  const result = await fetchTwitterUrl(url);

  if (result.success) {
    console.log(result.content);
    console.log('---');
  }

  // 加延遲避免被限流
  await new Promise(r => setTimeout(r, 2000));
}
```

---

## 🛠️ **故障排除**

### **問題 1：一直提示「Twitter cookies 不存在」**

**解決方法：**
```bash
# 重新提取 cookies
hedda-extract-twitter-cookies

# 檢查 cookies 是否存在
ls -la /tmp/twitter_cookies.sh
```

---

### **問題 2：Bird CLI 一直失敗**

**可能原因：**
1. Cookies 已過期
2. Twitter 帳號被登出

**解決方法：**
```bash
# 重新提取 cookies
hedda-extract-twitter-cookies

# 使用 verbose 模式查看詳細錯誤
node twitter-smart-router.js <url> --verbose
```

---

### **問題 3：所有方案都失敗**

**解決方法：**
```bash
# 1. 使用 verbose 模式查看詳細錯誤
node twitter-smart-router.js <url> --verbose

# 2. 檢查網路連接
ping x.com

# 3. 強制使用不同方案測試
node twitter-smart-router.js <url> --force twitterapi
```

---

## 📊 **路由策略詳解**

### **單條推文（tweet）**
```
優先順序：Bird CLI → twitterapi → Playwright
原因：Bird 免費且速度快
```

### **用戶主頁（profile）**
```
優先順序：twitterapi → Bird CLI → Playwright
原因：twitterapi 有完整的互動數據（讚數、轉推數等）
```

### **搜尋（search）**
```
優先順序：twitterapi → Bird CLI → Playwright
原因：twitterapi 的 advanced_search API 最穩定
```

### **X Article**
```
優先順序：Bird CLI → Playwright
原因：只有 Bird CLI 能讀取完整 Article 內容
```

---

## 📦 **檔案位置**

| 檔案 | 位置 | 說明 |
|------|------|------|
| **主程式** | `/Users/heddaai/clawd/pimi-reports/twitter-smart-router.js` | Smart Router 主程式 |
| **Cookies** | `/tmp/twitter_cookies.sh` | Twitter 認證資訊 |
| **Skill 定義** | `/Users/heddaai/clawd/my-skills/twitter-smart-router/` | Skill 說明文件 |

---

## 🔄 **更新日誌**

### **v1.1.2 - 2026-02-26**
- ✅ 修正 shell 執行環境從 bash 改為 zsh
- ✅ 改進輸出過濾，移除 bird CLI 的 info 訊息
- ✅ 沒有 cookies 時明確提示
- ✅ 更穩定的錯誤處理和成功判斷

### **v1.1.1 - 2026-02-26**
- ✅ 更新 cookie 路徑為 `/tmp/twitter_cookies.sh`
- ✅ 保持與舊路徑的向後兼容

### **v1.1.0 - 2026-02-26**
- ✅ Bird CLI 整合 Safari cookies 認證
- ✅ 支援讀取需要登入的推文

### **v1.0.0 - 初版**
- ✅ 智能路由系統
- ✅ 自動選擇最低成本方案

---

## 💡 **最佳實踐**

### **1. 定期更新 Cookies**
```bash
# 建議每週執行一次
hedda-extract-twitter-cookies
```

### **2. 使用 verbose 模式排查問題**
```bash
# 遇到問題時總是加上 --verbose
node twitter-smart-router.js <url> --verbose
```

### **3. 批量抓取時加延遲**
```javascript
// 避免被限流
await new Promise(r => setTimeout(r, 2000)); // 每次間隔 2 秒
```

### **4. 檢查返回值**
```javascript
// 總是檢查 success 狀態
if (result.success) {
  // 處理成功
} else {
  // 處理失敗
  console.error(result.error);
}
```

---

## 🆘 **需要幫助？**

如果遇到任何問題，可以：

1. **查看詳細錯誤訊息**
   ```bash
   node twitter-smart-router.js <url> --verbose
   ```

2. **檢查 cookies 狀態**
   ```bash
   cat /tmp/twitter_cookies.sh
   ```

3. **重新提取 cookies**
   ```bash
   hedda-extract-twitter-cookies
   ```

---

**🩵 Made with love by Hedda & Piggyx**
