#!/bin/bash

# 建立 Sidecar Shortcut
# Created for Hedda 姐姐 by Piggyx 🩵

echo "📱 正在建立 Sidecar 快速指令..."

# 建立一個 shortcut 檔案
cat > /tmp/Connect-iPad.shortcut <<'EOF'
{
  "WFWorkflowActions" : [
    {
      "WFWorkflowActionIdentifier" : "is.workflow.actions.sidecar.connect",
      "WFWorkflowActionParameters" : {
        "WFSidecarDevice" : "iPad mini"
      }
    }
  ],
  "WFWorkflowClientRelease" : "2.2.2",
  "WFWorkflowMinimumClientVersion" : 900,
  "WFWorkflowName" : "Connect iPad mini"
}
EOF

echo "✅ Shortcut 檔案已建立"
echo ""
echo "📝 請手動完成以下步驟："
echo ""
echo "1. 開啟「捷徑」app"
echo "2. 點擊右上角 '+' 新增捷徑"
echo "3. 點擊「加入動作」"
echo "4. 搜尋「Sidecar」或「連接到」"
echo "5. 選擇「連接到 Sidecar」動作"
echo "6. 在動作中選擇你的「iPad mini」"
echo "7. 點擊捷徑名稱，改名為「Connect iPad mini」"
echo "8. 點擊「完成」"
echo ""
echo "完成後就可以用指令執行："
echo "  shortcuts run \"Connect iPad mini\""
echo ""
echo "或者我可以幫你加到別名："
echo "  ipad = shortcuts run \"Connect iPad mini\""
