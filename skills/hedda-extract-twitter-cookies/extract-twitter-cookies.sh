#!/bin/bash

# Hedda 提取 Twitter Cookies
# 用途：從另一台 Mac 的 Safari cookies 提取 Twitter 登入資訊

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COOKIES_DIR="$HOME/.twitter-cookies"
COOKIES_FILE="$COOKIES_DIR/cookies.sh"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐦 Hedda 提取 Twitter Cookies${NC}"
echo ""

# 檢查是否有提供 zip 檔案
if [ -z "$1" ]; then
    echo -e "${RED}❌ 請提供 Safari cookies zip 檔案路徑${NC}"
    echo ""
    echo "使用方式："
    echo -e "  ${GREEN}$0 <safari-cookies.zip>${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}📖 如何從另一台 Mac 提取 cookies（完整教學）${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}步驟 1：給終端機「完全磁碟取用權限」${NC}"
    echo "  1. 點選  → 系統設定 (System Settings)"
    echo "  2. 進入「隱私權與安全性」(Privacy & Security)"
    echo "  3. 找到「完全磁碟取用權限」(Full Disk Access)"
    echo "  4. 點擊 + 號，選擇「應用程式 → 工具程式 → 終端機.app」"
    echo "  5. 確認「終端機」已勾選 ✅"
    echo "  6. ${RED}重要：關閉並重新開啟終端機${NC}"
    echo ""
    echo -e "${YELLOW}步驟 2：確認權限（在另一台 Mac 的終端機執行）${NC}"
    echo -e "  ${GREEN}ls -lh ~/Library/Containers/com.apple.Safari/Data/Library/Cookies/Cookies.binarycookies${NC}"
    echo "  ↳ 看到檔案資訊 = 成功"
    echo "  ↳ 看到 \"Operation not permitted\" = 回步驟 1 重新設定"
    echo ""
    echo -e "${YELLOW}步驟 3：複製 cookies 到桌面${NC}"
    echo -e "  ${GREEN}cp ~/Library/Containers/com.apple.Safari/Data/Library/Cookies/Cookies.binarycookies ~/Desktop/safari-cookies.binarycookies${NC}"
    echo ""
    echo -e "${YELLOW}步驟 4：壓縮${NC}"
    echo -e "  ${GREEN}cd ~/Desktop${NC}"
    echo -e "  ${GREEN}zip safari-cookies.zip safari-cookies.binarycookies${NC}"
    echo ""
    echo -e "${YELLOW}步驟 5：傳送到這台電腦${NC}"
    echo "  • AirDrop 拖曳 safari-cookies.zip"
    echo "  • Telegram 傳送給自己"
    echo "  • iCloud Drive / Dropbox"
    echo ""
    echo -e "${YELLOW}步驟 6：執行此腳本${NC}"
    echo -e "  ${GREEN}$0 ~/Downloads/safari-cookies.zip${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${RED}⚠️  安全提醒：傳送後記得刪除桌面上的 cookies 檔案！${NC}"
    echo -e "  ${GREEN}rm ~/Desktop/safari-cookies.binarycookies${NC}"
    echo -e "  ${GREEN}rm ~/Desktop/safari-cookies.zip${NC}"
    exit 1
fi

ZIP_FILE="$1"

# 檢查檔案是否存在
if [ ! -f "$ZIP_FILE" ]; then
    echo -e "${RED}❌ 檔案不存在: $ZIP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 解壓縮 cookies 檔案...${NC}"

# 建立臨時目錄
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# 解壓縮
unzip -q "$ZIP_FILE"

# 找到 binarycookies 檔案
BINARY_COOKIES=$(find . -name "*.binarycookies" | head -1)

if [ -z "$BINARY_COOKIES" ]; then
    echo -e "${RED}❌ 找不到 .binarycookies 檔案${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✅ 找到 cookies 檔案${NC}"

# 檢查是否安裝 binarycookies
if ! python3 -c "import binarycookies" 2>/dev/null; then
    echo -e "${YELLOW}📦 安裝 binarycookies 解析工具...${NC}"
    pip3 install binarycookies -q
fi

# 確保 bcparser 在 PATH
BCPARSER="/Users/heddaai/Library/Python/3.9/bin/bcparser"
if [ ! -f "$BCPARSER" ]; then
    BCPARSER=$(which bcparser 2>/dev/null || echo "")
fi

if [ -z "$BCPARSER" ]; then
    echo -e "${RED}❌ 找不到 bcparser 工具${NC}"
    echo "嘗試重新安裝：pip3 install --force-reinstall binarycookies"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${YELLOW}🔍 解析 cookies...${NC}"

# 解析 cookies
$BCPARSER "$BINARY_COOKIES" > cookies.json

# 提取 auth_token 和 ct0
RESULT=$(python3 << 'EOF'
import json
import sys
from datetime import datetime

with open('cookies.json', 'r') as f:
    cookies = json.load(f)

auth_token = None
ct0 = None
expiry = None

for c in cookies:
    if c['name'] == 'auth_token':
        auth_token = c['value']
        expiry = c.get('expiry_datetime', '')
    elif c['name'] == 'ct0':
        ct0 = c['value']

if auth_token and ct0:
    # 計算剩餘天數
    if expiry:
        try:
            expiry_date = datetime.fromisoformat(expiry.replace('Z', '+00:00'))
            now = datetime.now(expiry_date.tzinfo)
            days_left = (expiry_date - now).days
            print(f"SUCCESS|{auth_token}|{ct0}|{days_left}")
        except:
            print(f"SUCCESS|{auth_token}|{ct0}|Unknown")
    else:
        print(f"SUCCESS|{auth_token}|{ct0}|Unknown")
else:
    print("FAILED")
    sys.exit(1)
EOF
)

# 清理臨時目錄
cd - > /dev/null
rm -rf "$TEMP_DIR"

# 檢查結果
if [[ $RESULT == SUCCESS* ]]; then
    IFS='|' read -r status auth_token ct0 days_left <<< "$RESULT"

    # 建立 cookies 目錄
    mkdir -p "$COOKIES_DIR"

    # 儲存 cookies
    cat > "$COOKIES_FILE" << COOKIESEOF
# Twitter Cookies
# 提取時間: $(date "+%Y-%m-%d %H:%M:%S")
# 剩餘天數: $days_left 天

export TWITTER_AUTH_TOKEN="$auth_token"
export TWITTER_CT0="$ct0"
COOKIESEOF

    chmod 600 "$COOKIES_FILE"

    echo ""
    echo -e "${GREEN}✅ Cookies 提取成功！${NC}"
    echo -e "${BLUE}📁 儲存位置: $COOKIES_FILE${NC}"
    echo -e "${YELLOW}⏰ 剩餘天數: $days_left 天${NC}"
    echo ""
    echo "使用方式："
    echo -e "  ${GREEN}source $COOKIES_FILE${NC}"
    echo -e "  ${GREEN}bird user-tweets elonmusk --auth-token \"\$TWITTER_AUTH_TOKEN\" --ct0 \"\$TWITTER_CT0\" -n 5${NC}"
    echo ""
    echo "或者使用簡化命令："
    echo -e "  ${GREEN}twitter-read <URL>${NC}"

    # 建立簡化命令
    cat > "$COOKIES_DIR/twitter-read.sh" << 'READEOF'
#!/bin/bash
source "$HOME/.twitter-cookies/cookies.sh"
bird read "$@" --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0"
READEOF

    cat > "$COOKIES_DIR/twitter-user.sh" << 'USEREOF'
#!/bin/bash
source "$HOME/.twitter-cookies/cookies.sh"
bird user-tweets "$@" --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0"
USEREOF

    cat > "$COOKIES_DIR/twitter-search.sh" << 'SEARCHEOF'
#!/bin/bash
source "$HOME/.twitter-cookies/cookies.sh"
bird search "$@" --auth-token "$TWITTER_AUTH_TOKEN" --ct0 "$TWITTER_CT0"
SEARCHEOF

    chmod +x "$COOKIES_DIR"/*.sh

    # 建立 alias
    echo ""
    echo "建議加入 ~/.zshrc 的 alias："
    echo -e "  ${BLUE}alias twitter-read='$COOKIES_DIR/twitter-read.sh'${NC}"
    echo -e "  ${BLUE}alias twitter-user='$COOKIES_DIR/twitter-user.sh'${NC}"
    echo -e "  ${BLUE}alias twitter-search='$COOKIES_DIR/twitter-search.sh'${NC}"

else
    echo -e "${RED}❌ 提取失敗：找不到 auth_token 或 ct0${NC}"
    exit 1
fi
