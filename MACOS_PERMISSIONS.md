# 🔐 macOS 權限配置指南

> **重要**：Bot 需要特定的 macOS 權限才能正常工作。安裝腳本會自動檢查權限，但某些權限需要手動授予。

## 📋 所需權限清單

### 1. 完整磁盤訪問權限 ⭐ 最重要

**為什麼需要**：
- 讀取和寫入用戶目錄下的文件
- 訪問 `~/Documents`、`~/Desktop`、`~/Downloads` 等目錄
- 執行文件操作命令

**如何授予**：

1. 打開「系統設置」（System Settings）
2. 前往「隱私與安全性」（Privacy & Security）
3. 點擊「完整磁盤訪問權限」（Full Disk Access）
4. 點擊鎖圖標 🔒 並輸入密碼
5. 點擊「+」按鈕
6. 找到並添加你正在使用的終端應用：

   **Terminal.app**：
   ```
   /Applications/Utilities/Terminal.app
   ```

   **iTerm.app**：
   ```
   /Applications/iTerm.app
   ```

   **Warp.app**：
   ```
   /Applications/Warp.app
   ```

   **Alacritty**（如果使用）：
   ```
   /Applications/Alacritty.app
   ```

7. 確保終端應用旁的開關已開啟 ✅
8. **重啟終端應用**（重要！）

### 2. 開發者工具權限

**為什麼需要**：
- 執行 Bash 腳本和命令
- 運行子進程
- 使用 Claude CLI

**如何授予**：

1. 打開「系統設置」→「隱私與安全性」→「開發者工具」
2. 確保你的終端應用在列表中
3. 如果不在，通常在首次運行時會自動請求

### 3. 網絡連接權限

**為什麼需要**：
- 連接到 Telegram Bot API
- 連接到 Claude API
- 下載和上傳文件

**如何授予**：

1. 打開「系統設置」→「隱私與安全性」→「防火牆」
2. 如果啟用了防火牆，確保允許傳入連接：
   - 允許 `bun`
   - 允許你的終端應用

### 4. 輔助功能權限（可選）

**為什麼可能需要**：
- 某些高級功能可能需要

**如何授予**：

1. 打開「系統設置」→「隱私與安全性」→「輔助功能」
2. 添加你的終端應用

## 🚀 快速設置流程

### 方法 1：使用安裝腳本（推薦）

```bash
cd hedda-telegram-bot
bun run setup.ts
```

安裝腳本會：
- ✅ 自動檢測所有權限狀態
- ✅ 提供詳細的授權指導
- ✅ 可選擇直接打開系統設置
- ✅ 等待你完成授權後繼續

### 方法 2：手動檢查

```bash
# 測試文件訪問權限
ls ~/Documents
ls ~/Desktop
ls ~/Library/Application\ Support

# 測試命令執行權限
bash -c "echo test"

# 測試網絡連接
curl -I https://api.telegram.org
```

如果以上命令都能正常執行，權限配置正確！

## ⚠️ 常見問題

### Q1: 為什麼需要完整磁盤訪問權限？

**A**: Bot 需要讀寫你的項目文件、文檔和代碼。完整磁盤訪問權限確保：
- 可以在任何目錄創建和修改文件
- 可以讀取配置文件
- 可以執行 git 等命令

**安全性**：Bot 代碼是開源的，你可以審查所有操作。設置用戶白名單確保只有授權用戶可以使用。

### Q2: 授權後仍然沒有權限？

**A**: 請嘗試：
1. ✅ **重啟終端應用**（最常見原因）
2. ✅ 確認在系統設置中開關已開啟
3. ✅ 檢查是否授權了正確的應用
4. ✅ 登出並重新登入 macOS

### Q3: 如何撤銷權限？

**A**: 在「系統設置」→「隱私與安全性」中：
1. 找到對應的權限類別
2. 選中終端應用
3. 點擊「-」按鈕移除
4. 或關閉旁邊的開關

### Q4: iTerm 和 Terminal 需要分別授權嗎？

**A**: 是的。每個終端應用需要單獨授權。如果你切換終端，記得為新終端授權。

### Q5: 使用 VS Code 內置終端需要授權嗎？

**A**: 是的。需要為 VS Code 授權：
```
/Applications/Visual Studio Code.app
```

### Q6: 可以用 Rosetta（Intel 模式）運行嗎？

**A**: 可以，但：
- M 系列 Mac 建議使用原生 ARM 版本（更快）
- Intel Mac 使用 x86 版本
- 權限配置方式相同

## 🔍 權限驗證

運行以下命令測試權限是否正確配置：

```bash
# 進入 bot 目錄
cd hedda-telegram-bot

# 創建測試腳本
cat > test-permissions.sh << 'EOF'
#!/bin/bash
echo "🔍 測試 macOS 權限..."
echo ""

# 測試 1: 文件訪問
echo "1️⃣ 測試文件訪問權限..."
if ls ~/Documents >/dev/null 2>&1 && ls ~/Desktop >/dev/null 2>&1; then
    echo "   ✅ 文件訪問正常"
else
    echo "   ❌ 文件訪問受限"
fi

# 測試 2: 命令執行
echo "2️⃣ 測試命令執行權限..."
if bash -c "echo test" >/dev/null 2>&1; then
    echo "   ✅ 命令執行正常"
else
    echo "   ❌ 命令執行受限"
fi

# 測試 3: 網絡連接
echo "3️⃣ 測試網絡連接..."
if curl -I https://api.telegram.org >/dev/null 2>&1; then
    echo "   ✅ 網絡連接正常"
else
    echo "   ❌ 網絡連接受限"
fi

# 測試 4: 寫入權限
echo "4️⃣ 測試寫入權限..."
if touch .test-file && rm .test-file 2>/dev/null; then
    echo "   ✅ 寫入權限正常"
else
    echo "   ❌ 寫入權限受限"
fi

echo ""
echo "📊 測試完成！"
EOF

chmod +x test-permissions.sh
./test-permissions.sh
```

如果所有測試都通過 ✅，你的權限配置正確！

## 📱 開始使用

權限配置完成後：

```bash
# 如果還沒安裝
bun run setup.ts

# 啟動 bot
./start.sh

# 或使用 bun
bun run src/index.ts
```

在 Telegram 中向你的 bot 發送 `/start` 開始對話！

## 🆘 仍然遇到問題？

1. 查看錯誤日誌：
   ```bash
   tail -f bot-error.log
   tail -f logs/activity.log
   ```

2. 檢查是否有其他安全軟件（如防病毒）阻止訪問

3. 確認 macOS 版本：
   - macOS 13 (Ventura) 或更新版本推薦
   - macOS 12 (Monterey) 及更早版本可能需要不同的設置路徑

4. 查看系統日誌：
   ```bash
   log show --predicate 'process == "tccd"' --last 5m
   ```

---

**Made with 🩵 by Hedda AI**

記住：這些權限是為了讓 Bot 能夠為你工作。代碼完全透明，你可以隨時審查！
