# 快速開始指南 - Hedda 提取 Twitter Cookies

## 🚀 3 分鐘快速上手

### 在另一台 Mac（終端機操作）

#### 第 1 步：設定權限（首次需要）

```
 → 系統設定 → 隱私權與安全性 → 完全磁碟取用權限
→ 點 + 加入「終端機.app」→ 重啟終端機
```

#### 第 2 步：複製並打包（複製貼上即可）

```bash
# 一次執行全部（複製整段貼上）
cp ~/Library/Containers/com.apple.Safari/Data/Library/Cookies/Cookies.binarycookies ~/Desktop/safari-cookies.binarycookies && \
cd ~/Desktop && \
zip safari-cookies.zip safari-cookies.binarycookies && \
echo "✅ 完成！現在傳送 safari-cookies.zip 到目標電腦"
```

#### 第 3 步：傳送檔案

- AirDrop 拖曳 `safari-cookies.zip`
- 或用 Telegram/iCloud 傳送

#### 第 4 步：清理（建議）

```bash
rm ~/Desktop/safari-cookies.binarycookies ~/Desktop/safari-cookies.zip
```

---

### 在目標電腦（收到檔案後）

```bash
# 提取 cookies（會顯示剩餘天數）
./extract-twitter-cookies.sh ~/Downloads/safari-cookies.zip

# 使用
twitter-user elonmusk -n 5       # 讀取使用者推文
twitter-read "https://x.com/..." # 讀取推文
twitter-search "crypto"          # 搜尋推文
```

---

## 📊 檢查狀態

```bash
# 查看剩餘天數
cat ~/.twitter-cookies/cookies.sh | grep "剩餘天數"
```

---

## ⚠️ 常見問題

### "Operation not permitted"
→ 回第 1 步，確認終端機已加入權限並**重啟終端機**

### Cookies 過期
→ 重新執行「在另一台 Mac」的步驟提取新的

### 找不到 twitter-read 命令
→ 執行：
```bash
alias twitter-read="$HOME/.twitter-cookies/twitter-read.sh"
alias twitter-user="$HOME/.twitter-cookies/twitter-user.sh"
alias twitter-search="$HOME/.twitter-cookies/twitter-search.sh"
```

---

## 📁 檔案位置

- Cookies: `~/.twitter-cookies/cookies.sh`
- 命令: `~/.twitter-cookies/twitter-*.sh`

---

**作者**: Hedda 姐姐 & Piggyx 🩵
