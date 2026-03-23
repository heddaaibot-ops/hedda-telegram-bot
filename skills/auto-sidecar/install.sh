#!/bin/bash

# Auto Sidecar 安裝腳本
# Created for Hedda 姐姐 by Piggyx 🩵

echo "🚀 安裝 Auto Sidecar..."

SKILL_DIR="/Users/heddaai/clawd/my-skills/auto-sidecar"

# 添加別名到 .zshrc
if ! grep -q "auto-sidecar" ~/.zshrc; then
    echo "" >> ~/.zshrc
    echo "# Auto Sidecar for iPad mini" >> ~/.zshrc
    echo "alias ipad='python3 $SKILL_DIR/auto-sidecar.py connect'" >> ~/.zshrc
    echo "alias ipad-off='python3 $SKILL_DIR/auto-sidecar.py disconnect'" >> ~/.zshrc
    echo "alias ipad-status='python3 $SKILL_DIR/auto-sidecar.py status'" >> ~/.zshrc
    echo "✅ 別名已添加到 .zshrc"
else
    echo "ℹ️  別名已存在"
fi

echo ""
echo "📝 使用方式："
echo "  ipad          - 連接 iPad mini"
echo "  ipad-off      - 斷開 iPad mini"
echo "  ipad-status   - 檢查狀態"
echo ""
echo "⚠️  首次使用需要授予「輔助使用」權限"
echo ""
echo "✅ 安裝完成！執行 'source ~/.zshrc' 或重啟終端機生效"
