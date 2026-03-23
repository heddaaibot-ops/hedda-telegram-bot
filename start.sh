#!/bin/bash

# Hedda Telegram Bot 启动脚本
# 使用方法：./start.sh

set -e

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 啟動 Hedda Telegram Bot...${NC}"

# 檢查 .env 是否存在
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ 錯誤：.env 文件不存在${NC}"
    echo -e "${YELLOW}請先運行：bun run setup.ts${NC}"
    exit 1
fi

# 檢查 Bun 是否安裝
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ 錯誤：Bun 未安裝${NC}"
    echo -e "${YELLOW}請安裝 Bun：curl -fsSL https://bun.sh/install | bash${NC}"
    exit 1
fi

# 創建日誌目錄
mkdir -p logs

# 啟動 bot
echo -e "${GREEN}✅ 啟動中...${NC}"
bun run src/index.ts

# 如果 bot 退出
echo -e "${YELLOW}⚠️ Bot 已停止${NC}"
