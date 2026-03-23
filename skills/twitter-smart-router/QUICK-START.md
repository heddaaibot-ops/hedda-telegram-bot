# 🚀 Twitter Smart Router 快速上手

## 3 步開始使用

### **Step 1: 確保有 Twitter Cookies**

```bash
hedda-extract-twitter-cookies
```

如果提示成功，你會看到：
```
✅ Twitter cookies 已保存到 /tmp/twitter_cookies.sh
```

---

### **Step 2: 進入工作目錄**

```bash
cd /Users/heddaai/clawd/pimi-reports
```

---

### **Step 3: 開始使用**

#### **抓取單條推文**
```bash
node twitter-smart-router.js https://x.com/elonmusk/status/2026942204170940504
```

#### **抓取用戶最新推文**
```bash
node twitter-smart-router.js https://twitter.com/VitalikButerin
```

#### **搜尋推文**
```bash
node twitter-smart-router.js "https://x.com/search?q=bitcoin"
```

---

## 💡 常用選項

### **顯示詳細過程**
```bash
node twitter-smart-router.js <url> --verbose
```

### **輸出 JSON 格式**
```bash
node twitter-smart-router.js <url> --json
```

### **強制使用免費方案**
```bash
node twitter-smart-router.js <url> --force bird
```

---

## 🆘 遇到問題？

### **提示「cookies 不存在」**
```bash
# 重新提取 cookies
hedda-extract-twitter-cookies
```

### **Bird CLI 失敗**
```bash
# 查看詳細錯誤
node twitter-smart-router.js <url> --verbose
```

### **所有方案都失敗**
```bash
# 檢查 cookies
cat /tmp/twitter_cookies.sh

# 重新提取
hedda-extract-twitter-cookies
```

---

## 🎯 就這麼簡單！

Smart Router 會自動幫你選擇最便宜、最快的方式抓取 Twitter 內容！

需要更詳細的說明？查看 [完整文檔](README.md)
