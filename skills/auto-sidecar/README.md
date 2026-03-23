# 🖥️ 連結iPad - Auto Sidecar Skill

自動連接 iPad「Hedda🦋」作為第二螢幕的 skill

## ✨ 功能

一鍵自動連接你的 iPad 到 macOS Sidecar，無需手動點擊控制中心！

## 🚀 使用方式

### 方法一：直接呼叫 Claude（推薦）

只要跟 Claude 說：
- 「連結iPad」
- 「連接iPad」
- 「connect iPad」
- 「幫我連iPad」

Claude 就會自動執行腳本連接你的 iPad！

### 方法二：命令列執行

```bash
# 執行連接腳本
/Users/heddaai/clawd/my-skills/auto-sidecar/connect-ipad.sh

# 或直接執行桌面版本
/Users/heddaai/Desktop/連接iPad-最終版.command
```

### 方法三：設定 alias（可選）

在你的 `~/.zshrc` 加入：

```bash
alias ipad="/Users/heddaai/Desktop/連接iPad-最終版.command"
```

然後只要在終端機輸入 `ipad` 就能連接！

## 🔧 技術細節

這個 skill 使用：
- **JXA (JavaScript for Automation)** - 自動化控制 macOS UI
- **Accessibility API** - 操作控制中心介面
- **設備 UUID 識別** - 精準找到目標 iPad

### 關鍵技術要點

1. **中文系統適配** - 使用正確的動作名稱 `Name:顯示詳細資訊`
2. **UUID 識別** - 使用設備 UUID `1BD63B97-DD68-4120-92FE-E57790C55760` 而非設備名稱
3. **UI 結構導航** - 正確處理 Control Center 的巢狀 UI 結構

## 📝 開發歷程

經過多次迭代和診斷，最終成功實現：
- ✅ 解決權限問題
- ✅ 處理中文本地化
- ✅ 找到正確的 UI 元素路徑
- ✅ 使用 UUID 精準識別設備
- ✅ 穩定可靠的自動化流程

## 🎯 目標設備

- **設備名稱**: Hedda🦋
- **設備 UUID**: 1BD63B97-DD68-4120-92FE-E57790C55760
- **識別符**: screen-mirroring-device-Sidecar:1BD63B97-DD68-4120-92FE-E57790C55760

---

Created for Hedda 姐姐 by Claude 🩵
Version 2.0.0 - 完全自動化版本
