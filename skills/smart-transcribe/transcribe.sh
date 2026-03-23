#!/bin/bash

##############################################################################
# Smart Transcribe - 智能轉錄路由器
#
# 功能：
# - YouTube URL → NotebookLM
# - Twitter/X 影片 → faster-whisper (自動下載)
# - 本地影片/語音 → faster-whisper
# - 自動清理下載的臨時檔案
##############################################################################

set -e

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 工具路徑
FASTER_WHISPER="/Users/heddaai/clawd/my-skills/faster-whisper/scripts/transcribe"
NOTEBOOKLM_SKILL="/Users/heddaai/clawd/my-skills/anything-to-notebooklm"

# 臨時檔案追蹤
TEMP_FILES=()
TEMP_DIR=$(mktemp -d)

# 清理函數
cleanup() {
    if [ ${#TEMP_FILES[@]} -gt 0 ]; then
        echo -e "${YELLOW}🗑️  清理臨時檔案...${NC}"
        for file in "${TEMP_FILES[@]}"; do
            if [ -f "$file" ]; then
                rm -f "$file"
                echo -e "   ${GREEN}✓${NC} 已刪除: $(basename "$file")"
            fi
        done
    fi

    # 清理臨時目錄
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}

# 設定退出時自動清理
trap cleanup EXIT INT TERM

# 顯示使用方式
show_usage() {
    cat << EOF
${BLUE}🎙️  Smart Transcribe - 智能轉錄工具${NC}

${GREEN}使用方式:${NC}
  $(basename $0) [URL或檔案路徑] [選項]

${GREEN}支援來源:${NC}
  📺 YouTube URL        → 使用 NotebookLM (深度分析)
  🐦 Twitter/X 影片     → 使用 faster-whisper
  📁 本地影片/語音      → 使用 faster-whisper

${GREEN}範例:${NC}
  $(basename $0) https://youtube.com/watch?v=xxxxx
  $(basename $0) https://twitter.com/user/status/xxxxx
  $(basename $0) video.mp4
  $(basename $0) audio.mp3 --diarize

${GREEN}選項:${NC}
  --diarize          啟用說話者識別
  --format srt       輸出格式 (srt/vtt/txt/csv)
  --language zh      指定語言
  --help             顯示此說明

${YELLOW}提示:${NC} 下載的臨時檔案會在轉錄完成後自動刪除

EOF
    exit 0
}

# 判斷 URL 類型
is_youtube() {
    echo "$1" | grep -qE "(youtube\.com|youtu\.be)"
}

is_twitter() {
    echo "$1" | grep -qE "(twitter\.com|x\.com)"
}

is_url() {
    echo "$1" | grep -qE "^https?://"
}

# 主要處理邏輯
main() {
    if [ $# -eq 0 ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
        show_usage
    fi

    local input="$1"
    shift
    local options="$@"

    echo -e "${BLUE}🎙️  Smart Transcribe${NC}"
    echo ""

    # 判斷輸入類型並路由
    if is_youtube "$input"; then
        echo -e "${GREEN}📺 偵測到 YouTube 連結${NC}"
        echo -e "${BLUE}→ 使用 NotebookLM 進行深度分析${NC}"
        echo ""

        # 檢查 NotebookLM skill 是否存在
        if [ ! -d "$NOTEBOOKLM_SKILL" ]; then
            echo -e "${RED}❌ NotebookLM skill 未安裝${NC}"
            echo -e "${YELLOW}💡 建議使用: /anything-to-notebooklm${NC}"
            exit 1
        fi

        # 調用 NotebookLM
        cd "$NOTEBOOKLM_SKILL"
        node index.js "$input"

    elif is_twitter "$input"; then
        echo -e "${GREEN}🐦 偵測到 Twitter/X 影片${NC}"
        echo -e "${BLUE}→ 使用 faster-whisper (含自動下載)${NC}"
        echo ""

        # 先下載到臨時目錄
        cd "$TEMP_DIR"
        echo -e "${YELLOW}📥 下載影片...${NC}"

        # 使用 yt-dlp 下載
        if ! command -v yt-dlp &> /dev/null; then
            echo -e "${RED}❌ 需要安裝 yt-dlp: brew install yt-dlp${NC}"
            exit 1
        fi

        yt-dlp -f "best" -o "twitter_video.%(ext)s" "$input"

        # 找到下載的檔案
        downloaded_file=$(ls twitter_video.* 2>/dev/null | head -1)
        if [ -z "$downloaded_file" ]; then
            echo -e "${RED}❌ 下載失敗${NC}"
            exit 1
        fi

        TEMP_FILES+=("$TEMP_DIR/$downloaded_file")
        echo -e "${GREEN}✓ 下載完成: $downloaded_file${NC}"
        echo ""

        # 使用 faster-whisper 轉錄
        echo -e "${YELLOW}🎙️  開始轉錄...${NC}"
        "$FASTER_WHISPER" "$downloaded_file" $options

        # 檢查是否有生成的輸出檔案（字幕等）
        for ext in txt srt vtt csv; do
            if ls twitter_video*.$ext 2>/dev/null; then
                output_file=$(ls twitter_video*.$ext | head -1)
                # 移動到當前目錄
                mv "$output_file" "$(pwd)/" 2>/dev/null || true
            fi
        done

    elif is_url "$input"; then
        echo -e "${GREEN}🌐 偵測到 URL${NC}"
        echo -e "${BLUE}→ 使用 faster-whisper (含自動下載)${NC}"
        echo ""

        # 直接用 faster-whisper 處理（它支援 URL）
        "$FASTER_WHISPER" "$input" $options

    else
        # 本地檔案
        if [ ! -f "$input" ]; then
            echo -e "${RED}❌ 檔案不存在: $input${NC}"
            exit 1
        fi

        echo -e "${GREEN}📁 偵測到本地檔案${NC}"
        echo -e "${BLUE}→ 使用 faster-whisper${NC}"
        echo ""

        "$FASTER_WHISPER" "$input" $options
    fi

    echo ""
    echo -e "${GREEN}✅ 轉錄完成！${NC}"
}

# 執行主程式
main "$@"
