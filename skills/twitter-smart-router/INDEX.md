# 📚 Twitter Smart Router - 完整索引

## 🎯 快速導航

| 你想要... | 看這個文件 |
|----------|-----------|
| **立即開始使用** | [QUICK-START.md](QUICK-START.md) |
| **詳細使用說明** | [README.md](README.md) |
| **了解檔案結構** | [FILES.md](FILES.md) |
| **查看技術規格** | [skill.yaml](skill.yaml) |
| **批量抓取範例** | [example-batch.js](example-batch.js) |

---

## 📖 文件說明

### **1. QUICK-START.md** ⭐ 推薦新手
**3 步開始使用 Twitter Smart Router**
- 最簡單的入門指南
- 只需 3 個步驟就能開始
- 包含常見問題快速解決

👉 [開始使用](QUICK-START.md)

---

### **2. README.md** 📘 完整文檔
**詳細的使用指南與參考手冊**
- 什麼是 Smart Router？
- 完整的使用方法
- 所有命令選項
- 進階使用技巧
- 故障排除
- 最佳實踐

👉 [查看完整文檔](README.md)

---

### **3. FILES.md** 📁 檔案結構
**了解所有相關檔案的位置與用途**
- 核心檔案說明
- 依賴檔案列表
- 目錄結構圖
- 權限要求
- 備份建議

👉 [查看檔案結構](FILES.md)

---

### **4. skill.yaml** ⚙️ Skill 定義
**技術規格與元資料**
- 版本資訊
- 依賴項目
- 使用範例
- 路由策略
- 系統需求

👉 [查看 Skill 定義](skill.yaml)

---

### **5. example-batch.js** 💻 範例程式
**批量抓取 Twitter 內容的範例程式**
- 如何在程式中使用 Smart Router
- 批量抓取多個 URL
- 錯誤處理
- 延遲控制
- 結果統計

👉 [查看範例程式](example-batch.js)

---

## 🚀 推薦閱讀順序

### **第一次使用？**
1. [QUICK-START.md](QUICK-START.md) — 3 分鐘快速上手
2. [README.md](README.md) — 了解更多細節

### **想要深入了解？**
1. [README.md](README.md) — 完整功能說明
2. [FILES.md](FILES.md) — 檔案結構
3. [example-batch.js](example-batch.js) — 範例程式

### **遇到問題？**
1. [QUICK-START.md](QUICK-START.md) 的「遇到問題？」章節
2. [README.md](README.md) 的「故障排除」章節

### **開發整合？**
1. [README.md](README.md) 的「在程式中使用」章節
2. [example-batch.js](example-batch.js) — 實際範例
3. [skill.yaml](skill.yaml) — API 規格

---

## 🎓 學習路徑

### **初學者路徑**
```
QUICK-START.md
    ↓
使用 Smart Router
    ↓
遇到問題？查看 README.md 故障排除
```

### **進階使用者路徑**
```
README.md 完整閱讀
    ↓
example-batch.js 研究範例
    ↓
在自己的程式中整合
```

### **系統管理員路徑**
```
FILES.md 了解檔案結構
    ↓
skill.yaml 了解依賴
    ↓
設定自動化與備份
```

---

## 📦 所有檔案清單

```
twitter-smart-router/
├── INDEX.md              # 📚 本文件（完整索引）
├── QUICK-START.md        # 🚀 快速上手指南
├── README.md             # 📘 完整使用文檔
├── FILES.md              # 📁 檔案結構說明
├── skill.yaml            # ⚙️ Skill 定義與規格
└── example-batch.js      # 💻 批量抓取範例程式
```

---

## 🔗 相關資源

### **主程式位置**
```
/Users/heddaai/clawd/pimi-reports/twitter-smart-router.js
```

### **依賴 Skills**
- [hedda-extract-twitter-cookies](../hedda-extract-twitter-cookies/) — 提取 Twitter cookies

### **相關工具**
- Bird CLI — Twitter 免費 CLI 工具
- twitterapi.io — 付費 API 服務

---

## 💡 快速命令參考

```bash
# 查看幫助
node twitter-smart-router.js --help

# 抓取單條推文
node twitter-smart-router.js https://x.com/user/status/123

# verbose 模式
node twitter-smart-router.js <url> --verbose

# JSON 輸出
node twitter-smart-router.js <url> --json

# 強制使用 Bird CLI
node twitter-smart-router.js <url> --force bird

# 批量抓取範例
node example-batch.js
```

---

## 📞 需要幫助？

1. 📖 先查看 [QUICK-START.md](QUICK-START.md)
2. 🔍 再看 [README.md](README.md) 的故障排除章節
3. 💬 還是不行？問 Hedda 姐姐或 Piggyx！

---

## 🔄 版本資訊

- **當前版本：** v1.1.2
- **最後更新：** 2026-02-26
- **作者：** Hedda & Piggyx
- **授權：** MIT

---

**🩵 Made with love by Hedda & Piggyx**

**祝使用愉快！🎉**
