#!/bin/bash

# macOS 權限測試腳本
# 快速驗證所有必需權限是否正確配置

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          macOS 權限測試 - Hedda Telegram Bot           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# 測試計數
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 測試函數
test_permission() {
    local test_name="$1"
    local test_command="$2"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} ${test_name}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} ${test_name}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BOLD}1️⃣  文件訪問權限測試${NC}"
echo ""

# 測試用戶目錄訪問
test_permission "訪問 ~/Documents" "ls ~/Documents"
test_permission "訪問 ~/Desktop" "ls ~/Desktop"
test_permission "訪問 ~/Downloads" "ls ~/Downloads"
test_permission "訪問 ~/Library" "ls ~/Library"

echo ""
echo -e "${BOLD}2️⃣  命令執行權限測試${NC}"
echo ""

# 測試 bash 執行
test_permission "執行 bash 命令" "bash -c 'echo test'"
test_permission "執行 echo 命令" "echo test"
test_permission "執行 which 命令" "which bash"

echo ""
echo -e "${BOLD}3️⃣  網絡連接測試${NC}"
echo ""

# 測試網絡訪問
test_permission "連接 Telegram API" "curl -I https://api.telegram.org --max-time 5"
test_permission "連接 GitHub" "curl -I https://github.com --max-time 5"
test_permission "DNS 解析" "nslookup google.com"

echo ""
echo -e "${BOLD}4️⃣  文件讀寫測試${NC}"
echo ""

# 測試文件操作
test_permission "創建目錄" "mkdir -p .test-dir-perms"
test_permission "寫入文件" "echo 'test' > .test-file-perms"
test_permission "讀取文件" "cat .test-file-perms"
test_permission "刪除文件" "rm -f .test-file-perms && rmdir .test-dir-perms"

echo ""
echo -e "${BOLD}5️⃣  Bun 運行環境測試${NC}"
echo ""

# 測試 Bun
test_permission "Bun 已安裝" "which bun"
test_permission "Bun 可執行" "bun --version"

echo ""
echo -e "${BOLD}6️⃣  Claude CLI 測試（可選）${NC}"
echo ""

# 測試 Claude CLI
if which claude >/dev/null 2>&1; then
    test_permission "Claude CLI 已安裝" "which claude"
    echo -e "   ${BLUE}ℹ️  Claude CLI 路徑: $(which claude)${NC}"
else
    echo -e "${YELLOW}⚠️${NC}  Claude CLI 未安裝（可選，也可使用 API Key）"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}📊 測試結果摘要${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "   總測試數: ${BOLD}${TOTAL_TESTS}${NC}"
echo -e "   ${GREEN}✅ 通過: ${PASSED_TESTS}${NC}"
echo -e "   ${RED}❌ 失敗: ${FAILED_TESTS}${NC}"
echo ""

# 計算成功率
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "   成功率: ${BOLD}${SUCCESS_RATE}%${NC}"
    echo ""

    if [ $SUCCESS_RATE -eq 100 ]; then
        echo -e "${GREEN}${BOLD}🎉 完美！所有權限都已正確配置！${NC}"
        echo -e "${GREEN}   你可以開始使用 Bot 了：${NC}"
        echo -e "   ${CYAN}bun run src/index.ts${NC}"
        echo ""
        exit 0
    elif [ $SUCCESS_RATE -ge 80 ]; then
        echo -e "${YELLOW}${BOLD}⚠️  大部分權限已配置，但有些測試失敗${NC}"
        echo -e "${YELLOW}   請檢查失敗的項目，可能不影響使用${NC}"
        echo ""
        exit 1
    else
        echo -e "${RED}${BOLD}❌ 權限配置不完整${NC}"
        echo -e "${RED}   請按照以下步驟配置權限：${NC}"
        echo ""
        echo -e "   1. 打開 ${BOLD}系統設置${NC}"
        echo -e "   2. 前往 ${BOLD}隱私與安全性${NC} → ${BOLD}完整磁盤訪問權限${NC}"
        echo -e "   3. 添加你的終端應用"
        echo -e "   4. ${BOLD}重啟終端${NC}"
        echo ""
        echo -e "   詳細說明：${BLUE}cat MACOS_PERMISSIONS.md${NC}"
        echo ""
        exit 1
    fi
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
