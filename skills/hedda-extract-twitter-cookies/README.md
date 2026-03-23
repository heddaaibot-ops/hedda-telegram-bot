# Hedda 提取 Twitter Cookies

從另一台 Mac 的 Safari cookies 提取 Twitter 登入資訊，用於 bird CLI。

## 功能特色

✅ 從 Safari cookies 提取 Twitter 登入 token
✅ 自動計算 cookies 剩餘有效天數
✅ 建立簡化命令（twitter-read, twitter-user, twitter-search）
✅ 安全儲存到 `~/.twitter-cookies/`

## 使用方式

### 步驟 1：在另一台 Mac 上提取 Safari cookies（圖文教學）

#### 1️⃣ 給終端機「完全磁碟取用權限」

**為什麼需要？** Safari cookies 檔案受系統保護，需要特殊權限才能讀取。

**操作步驟：**

1. 點選 Apple 圖示  → **系統設定**
2. 進入 **隱私權與安全性** (Privacy & Security)
3. 找到 **完全磁碟取用權限** (Full Disk Access)
4. 點擊 **+** 號
5. 前往 **應用程式** → **工具程式** → 選擇 **終端機.app** (Terminal.app)
6. 確認「終端機」出現在列表中且已勾選 ✅
7. **重要：關閉並重新開啟終端機**（讓權限生效）

#### 2️⃣ 在終端機中執行以下指令

**打開終端機** (按 `⌘ + 空白鍵`，輸入「終端機」或「Terminal」)

```bash
# 確認 Safari cookies 檔案存在
ls -lh ~/Library/Containers/com.apple.Safari/Data/Library/Cookies/Cookies.binarycookies

# 如果看到檔案資訊（例如：-rw------- ... 16K ...），表示成功！
# 如果看到 "Operation not permitted"，回到步驟 1 重新設定權限並重啟終端機
```

#### 3️⃣ 複製 cookies 到桌面

```bash
# 複製檔案到桌面
cp ~/Library/Containers/com.apple.Safari/Data/Library/Cookies/Cookies.binarycookies ~/Desktop/safari-cookies.binarycookies

# 確認複製成功
ls -lh ~/Desktop/safari-cookies.binarycookies
```

#### 4️⃣ 壓縮成 zip 檔案

```bash
# 切換到桌面
cd ~/Desktop

# 壓縮檔案
zip safari-cookies.zip safari-cookies.binarycookies

# 確認壓縮成功（會看到 safari-cookies.zip）
ls -lh safari-cookies.zip
```

#### 5️⃣ 傳送到目標電腦

選擇以下任一方式：

- **AirDrop**：從桌面直接拖曳 `safari-cookies.zip` 到 AirDrop
- **Telegram**：傳送 `safari-cookies.zip` 給自己或機器人
- **iCloud Drive / Dropbox**：上傳後在另一台下載
- **Email**：寄給自己（不建議，較不安全）

**安全提醒：** 這個檔案包含你的 Twitter 登入資訊，傳送後記得刪除桌面上的檔案！

```bash
# 傳送完成後，刪除桌面檔案（可選）
rm ~/Desktop/safari-cookies.binarycookies
rm ~/Desktop/safari-cookies.zip
```

### 步驟 2：在目標電腦上執行腳本

```bash
# 提取 cookies
./extract-twitter-cookies.sh ~/Downloads/safari-cookies.zip
```

### 步驟 3：使用

執行完成後會自動建立以下命令：

```bash
# 讀取推文
twitter-read "https://x.com/user/status/123"

# 讀取使用者推文
twitter-user elonmusk -n 10

# 搜尋推文
twitter-search "crypto" -n 20
```

## 輸出範例

```
🐦 Hedda 提取 Twitter Cookies

📦 解壓縮 cookies 檔案...
✅ 找到 cookies 檔案
🔍 解析 cookies...

✅ Cookies 提取成功！
📁 儲存位置: /Users/heddaai/.twitter-cookies/cookies.sh
⏰ 剩餘天數: 7 天

使用方式：
  source /Users/heddaai/.twitter-cookies/cookies.sh
  bird user-tweets elonmusk --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0" -n 5

或者使用簡化命令：
  twitter-read <URL>
```

## 手動使用 cookies

如果不想用簡化命令，可以手動載入：

```bash
# 載入 cookies
source ~/.twitter-cookies/cookies.sh

# 使用 bird CLI
bird user-tweets elonmusk --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0" -n 5
bird read "https://x.com/..." --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0"
bird search "keyword" --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0"
```

## 檢查 cookies 狀態

```bash
# 查看剩餘天數
cat ~/.twitter-cookies/cookies.sh | grep "剩餘天數"
```

## 注意事項

- Cookies 通常有效期 7-14 天
- 過期後需要重新從源頭 Mac 提取
- 不要分享你的 `cookies.sh` 檔案（包含敏感資訊）
- 建議定期更新 cookies

## 依賴

- Python 3
- pip3 install binarycookies
- npm install -g @steipete/bird

## 檔案位置

- Cookies: `~/.twitter-cookies/cookies.sh`
- 簡化命令: `~/.twitter-cookies/*.sh`

## Troubleshooting

### "Operation not permitted"

在源頭 Mac 上給終端機「完全磁碟取用權限」。

### "找不到 bcparser"

```bash
pip3 install --force-reinstall binarycookies
```

### Cookies 無效

確認源頭 Mac 的 Safari 有登入 x.com。

## 作者

Hedda 姐姐 & Piggyx 🩵

## 更新日誌

- 2026-02-26: 初版發布
  - 支援從 Safari cookies 提取
  - 自動計算剩餘天數
  - 建立簡化命令
