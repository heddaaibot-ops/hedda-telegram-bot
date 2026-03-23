# Extract Browser Cookies Skill

從瀏覽器（Chrome/Brave/Edge）提取特定網站的 cookies，用於自動化登錄和 API 訪問。

## 功能特點

- ✅ 支援多種 Chromium 瀏覽器（Brave、Chrome、Edge）
- ✅ 自動檢測可用的瀏覽器
- ✅ 安全複製數據庫，不影響瀏覽器運行
- ✅ 輸出 Playwright/Puppeteer 兼容格式
- ✅ 自動驗證登錄狀態（檢查關鍵 cookies）
- ✅ 支援多個常見網站（Twitter、GitHub、Reddit 等）

## 使用方法

### 基本用法

```bash
python3 extract-cookies.py [網站名稱] [瀏覽器(可選)]
```

### 範例

```bash
# 提取 Twitter cookies（自動檢測瀏覽器）
python3 extract-cookies.py twitter

# 指定使用 Brave 瀏覽器
python3 extract-cookies.py twitter brave

# 提取 GitHub cookies
python3 extract-cookies.py github

# 提取 Reddit cookies
python3 extract-cookies.py reddit
```

## 支援的網站

- `twitter` - Twitter/X
- `github` - GitHub
- `reddit` - Reddit
- `facebook` - Facebook
- `instagram` - Instagram
- `linkedin` - LinkedIn

可以使用任何自定義網站名稱，腳本會自動匹配域名。

## 支援的瀏覽器

- **Brave** - `/Library/Application Support/BraveSoftware/Brave-Browser/Default/Cookies`
- **Chrome** - `/Library/Application Support/Google/Chrome/Default/Cookies`
- **Edge** - `/Library/Application Support/Microsoft Edge/Default/Cookies`

## 輸出格式

Cookies 保存在 `~/.config/[網站名]-cookies.json`，格式：

```json
[
  {
    "name": "auth_token",
    "value": "...",
    "domain": ".twitter.com",
    "path": "/",
    "expires": 1234567890,
    "httpOnly": true,
    "secure": true,
    "sameSite": "None"
  }
]
```

## 在 Playwright 中使用

```javascript
const { chromium } = require('playwright');
const fs = require('fs');

const cookies = JSON.parse(fs.readFileSync(
  process.env.HOME + '/.config/twitter-cookies.json'
));

const browser = await chromium.launch();
const context = await browser.newContext();
await context.addCookies(cookies);

const page = await context.newPage();
await page.goto('https://twitter.com');
// 現在已經登錄了！
```

## 使用場景

1. **自動化測試** - 跳過登錄步驟，直接測試已登錄功能
2. **API 訪問** - 使用 cookies 訪問需要認證的 API
3. **數據抓取** - 抓取需要登錄才能看到的內容
4. **多帳號管理** - 快速切換不同帳號的 cookies

## 注意事項

⚠️ **安全提醒**：
- Cookies 包含登錄憑證，請妥善保管
- 不要分享 cookies 文件給他人
- 定期更新 cookies（通常有過期時間）
- 使用完畢後考慮刪除 cookies 文件

⚠️ **前提條件**：
- 需要在瀏覽器中先登錄目標網站
- 瀏覽器可以在運行中（腳本會複製數據庫）
- macOS 系統（路徑為 macOS 格式）

## 技術細節

### Cookies 數據庫格式

Chromium 使用 SQLite 存儲 cookies：

```sql
SELECT name, value, host_key, path, expires_utc, is_secure, is_httponly, samesite
FROM cookies
WHERE host_key LIKE '%twitter.com%' OR host_key LIKE '%x.com%'
```

### 時間戳轉換

Chrome 的 `expires_utc` 使用微秒，需要轉換：

```python
# Chrome epoch: 1601-01-01
# Unix epoch: 1970-01-01
# 差距: 11644473600 秒
expires = expires_utc / 1000000 - 11644473600
```

## 擴展 Skill

### 添加新網站

編輯 `extract-cookies.py`：

```python
SITE_DOMAINS = {
    "mysite": ["%mysite.com%"],
}

KEY_COOKIES = {
    "mysite": ["session_token"],
}
```

### 支援 Windows/Linux

修改 `BROWSER_PATHS`：

```python
import platform

if platform.system() == "Windows":
    BROWSER_PATHS = {
        "chrome": "AppData/Local/Google/Chrome/User Data/Default/Cookies",
    }
elif platform.system() == "Linux":
    BROWSER_PATHS = {
        "chrome": ".config/google-chrome/Default/Cookies",
    }
```

## 故障排除

### 找不到 Cookies 文件

```bash
# 手動查找
find ~/Library/Application\ Support -name "Cookies" 2>/dev/null
```

### 數據庫鎖定錯誤

腳本會自動複製數據庫，如果仍然出錯，請關閉瀏覽器後重試。

### 沒有找到 cookies

確認：
1. 在瀏覽器中已登錄該網站
2. 使用的是正確的瀏覽器（自動檢測可能選錯）
3. 網站域名配置正確

## 授權

MIT License - 自由使用和修改

## 作者

Hedda AI - 2026
