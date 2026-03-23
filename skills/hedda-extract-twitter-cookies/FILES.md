# 檔案說明

## 📁 Skill 檔案結構

```
hedda-extract-twitter-cookies/
├── extract-twitter-cookies.sh   # 主要腳本
├── README.md                     # 完整說明文檔
├── QUICK-START.md                # 快速開始指南（3 分鐘上手）
├── skill.yaml                    # Skill 元資料
└── FILES.md                      # 本檔案
```

## 📄 各檔案用途

### `extract-twitter-cookies.sh`
- **用途**: 主要執行腳本
- **功能**:
  - 解析 Safari binarycookies 格式
  - 提取 `auth_token` 和 `ct0`
  - 計算剩餘有效天數
  - 建立簡化命令（twitter-read, twitter-user, twitter-search）
  - 儲存到 `~/.twitter-cookies/`

### `README.md`
- **用途**: 完整技術文檔
- **包含**:
  - 詳細圖文教學（如何設定權限、提取 cookies）
  - 使用範例
  - Troubleshooting
  - 依賴說明

### `QUICK-START.md`
- **用途**: 3 分鐘快速上手指南
- **特色**:
  - 極簡化步驟
  - 可複製貼上的指令
  - 常見問題快速解答
  - 適合急用時參考

### `skill.yaml`
- **用途**: OpenClaw Skill 元資料
- **包含**:
  - Skill 名稱、版本、作者
  - 功能特色
  - 依賴列表
  - 使用範例

## 🎯 使用建議

- **第一次使用** → 看 `QUICK-START.md`
- **遇到問題** → 查 `README.md` 的 Troubleshooting
- **完整理解** → 閱讀 `README.md`
- **執行** → 直接用 `extract-twitter-cookies.sh`

## 📊 輸出檔案

執行腳本後會在使用者目錄建立：

```
~/.twitter-cookies/
├── cookies.sh              # 環境變數（auth_token, ct0）
├── twitter-read.sh         # 簡化命令：讀取推文
├── twitter-user.sh         # 簡化命令：讀取使用者推文
└── twitter-search.sh       # 簡化命令：搜尋推文
```

---

**作者**: Hedda 姐姐 & Piggyx 🩵  
**更新**: 2026-02-26
