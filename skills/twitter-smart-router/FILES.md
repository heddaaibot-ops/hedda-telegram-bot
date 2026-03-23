# 📁 Twitter Smart Router 檔案說明

## 核心檔案

### **1. twitter-smart-router.js**
- **位置：** `/Users/heddaai/clawd/pimi-reports/twitter-smart-router.js`
- **用途：** 主程式，智能路由邏輯
- **版本：** v1.1.2
- **大小：** ~15 KB
- **語言：** JavaScript (Node.js)

**主要功能：**
- URL 解析與分類
- 路由策略選擇
- Bird CLI 執行器
- twitterapi.io 執行器
- Playwright 執行器
- 錯誤處理與重試

---

## 依賴檔案

### **2. /tmp/twitter_cookies.sh**
- **用途：** Twitter 認證資訊
- **格式：** Bash export 變數
- **內容：**
  ```bash
  export TWITTER_AUTH_TOKEN="..."
  export TWITTER_CT0="..."
  ```
- **有效期：** 通常 7-14 天
- **生成方式：** `hedda-extract-twitter-cookies`

### **3. crypto-news-config.json** (選用)
- **位置：** `/Users/heddaai/clawd/pimi-reports/crypto-news-config.json`
- **用途：** twitterapi.io API key
- **格式：** JSON
- **內容範例：**
  ```json
  {
    "twitterApiKey": "your-api-key-here"
  }
  ```

---

## Skill 檔案

### **4. skill.yaml**
- **位置：** `/Users/heddaai/clawd/my-skills/twitter-smart-router/skill.yaml`
- **用途：** Skill 定義與元資料
- **格式：** YAML
- **內容：** 版本、作者、描述、用法等

### **5. README.md**
- **位置：** `/Users/heddaai/clawd/my-skills/twitter-smart-router/README.md`
- **用途：** 完整使用文檔
- **內容：** 詳細說明、範例、故障排除

### **6. QUICK-START.md**
- **位置：** `/Users/heddaai/clawd/my-skills/twitter-smart-router/QUICK-START.md`
- **用途：** 快速上手指南
- **內容：** 3 步開始使用

### **7. FILES.md**
- **位置：** `/Users/heddaai/clawd/my-skills/twitter-smart-router/FILES.md`
- **用途：** 檔案結構說明（本文件）

---

## 輸出檔案

### **8. stdout（標準輸出）**
- **格式：** 純文字或 JSON（依 `--json` 參數）
- **內容：** 推文內容、互動數據、時間戳

**範例（文字格式）：**
```
✅ 方案：bird | 類型：tweet

──────────────────────────────────────────────────
@elonmusk (Elon Musk):
Much tunneling
📅 Thu Feb 26 08:47:34 +0000 2026
❤️ 20361  🔁 2265  💬 1786
──────────────────────────────────────────────────
```

**範例（JSON 格式）：**
```json
{
  "success": true,
  "method": "bird",
  "content": "...",
  "type": "tweet",
  "parsed": {...},
  "strategyLog": [...]
}
```

---

## 目錄結構

```
/Users/heddaai/clawd/
├── pimi-reports/
│   └── twitter-smart-router.js          # 主程式
│   └── crypto-news-config.json          # API key (選用)
│
├── my-skills/
│   └── twitter-smart-router/
│       ├── skill.yaml                   # Skill 定義
│       ├── README.md                    # 完整文檔
│       ├── QUICK-START.md               # 快速上手
│       └── FILES.md                     # 檔案說明 (本文件)
│
/tmp/
└── twitter_cookies.sh                   # Twitter cookies
```

---

## 權限要求

| 檔案 | 權限 | 說明 |
|------|------|------|
| `twitter-smart-router.js` | `-rw-r--r--` | 可讀，可執行 |
| `/tmp/twitter_cookies.sh` | `-rw-r--r--` | 可讀（包含敏感資訊） |
| `crypto-news-config.json` | `-rw-------` | 僅擁有者可讀（包含 API key） |

---

## 檔案大小

| 檔案 | 大小 |
|------|------|
| `twitter-smart-router.js` | ~15 KB |
| `/tmp/twitter_cookies.sh` | ~250 bytes |
| `crypto-news-config.json` | ~500 bytes |
| `skill.yaml` | ~1 KB |
| `README.md` | ~8 KB |
| `QUICK-START.md` | ~1.5 KB |
| `FILES.md` | ~2 KB |

**總計：** ~28 KB

---

## 相關檔案

### **hedda-extract-twitter-cookies skill**
- **位置：** `/Users/heddaai/clawd/my-skills/hedda-extract-twitter-cookies/`
- **關係：** 生成 `/tmp/twitter_cookies.sh`

### **bird CLI**
- **位置：** `/opt/homebrew/bin/bird`
- **關係：** Smart Router 的主要執行器

### **~/.zshrc**
- **位置：** `/Users/heddaai/.zshrc`
- **關係：** 包含 Twitter aliases（twitter-read, twitter-search 等）

---

## 備份建議

### **重要檔案（建議備份）：**
1. `twitter-smart-router.js` — 主程式
2. `/tmp/twitter_cookies.sh` — Cookies（定期更新）
3. `crypto-news-config.json` — API key

### **不需備份：**
1. Skill 文檔（可重新生成）
2. 臨時輸出檔案

---

## 清理建議

### **定期清理（每 2 週）：**
```bash
# 重新提取 cookies（舊的會自動覆蓋）
hedda-extract-twitter-cookies
```

### **完全移除：**
```bash
# 移除 cookies
rm /tmp/twitter_cookies.sh

# 移除 skill（如果不需要）
rm -rf /Users/heddaai/clawd/my-skills/twitter-smart-router
```

---

**📝 注意：** 本文件描述 v1.1.2 版本的檔案結構
