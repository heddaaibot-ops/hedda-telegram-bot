# 🎙️ Smart Transcribe

智能轉錄路由器 - 自動選擇最佳工具並清理臨時檔案

## 功能特色

- 🧠 **智能路由** - 自動判斷輸入類型，選擇最佳工具
- 📺 **YouTube** → NotebookLM (深度分析 + 播客生成)
- 🐦 **Twitter/X** → faster-whisper (自動下載 + 轉錄)
- 📁 **本地檔案** → faster-whisper (高速轉錄)
- 🗑️ **自動清理** - 轉錄完成後自動刪除下載的臨時檔案

## 快速使用

```bash
# 建立別名（建議）
alias transcribe='/Users/heddaai/clawd/my-skills/smart-transcribe/transcribe.sh'

# 使用
transcribe [URL或檔案]
```

## 使用範例

### YouTube 影片
```bash
transcribe "https://youtube.com/watch?v=xxxxx"
# → 使用 NotebookLM 深度分析
# → 生成播客、摘要、思維導圖等
```

### Twitter/X 影片
```bash
transcribe "https://twitter.com/user/status/123456"
# → 自動下載影片
# → 使用 faster-whisper 轉錄
# → 自動刪除下載的檔案
```

### 本地影片
```bash
transcribe video.mp4
# → 直接使用 faster-whisper 轉錄
```

### 帶選項
```bash
# 說話者識別
transcribe interview.mp4 --diarize

# 生成 SRT 字幕
transcribe video.mp4 --format srt

# 指定語言
transcribe audio.mp3 --language zh
```

## 工作流程

```
輸入
 ├─ YouTube URL?
 │   └─ NotebookLM ──> 播客 + 摘要 + 思維導圖
 │
 ├─ Twitter/X URL?
 │   └─ yt-dlp 下載 ──> faster-whisper ──> 自動清理
 │
 └─ 本地檔案?
     └─ faster-whisper ──> 轉錄結果
```

## 支援格式

**輸入：**
- 影片：MP4, MOV, AVI, MKV, WebM
- 音訊：MP3, WAV, M4A, OGG, FLAC
- URL：YouTube, Twitter/X, 或任何 yt-dlp 支援的網站

**輸出：**
- TXT（純文字）
- SRT（字幕）
- VTT（網頁字幕）
- CSV（試算表）

## 自動清理機制

- Twitter/X 下載的影片會在轉錄完成後自動刪除
- 使用臨時目錄，確保不污染工作目錄
- 即使過程中斷（Ctrl+C），也會清理臨時檔案

## 依賴

- ✅ **faster-whisper skill** - 已安裝
- ✅ **anything-to-notebooklm skill** - 需要確認
- ✅ **yt-dlp** - 需要安裝：`brew install yt-dlp`

## 完整路徑

```bash
/Users/heddaai/clawd/my-skills/smart-transcribe/transcribe.sh
```

## 提示

建議在 `~/.zshrc` 加入別名：

```bash
echo 'alias transcribe="/Users/heddaai/clawd/my-skills/smart-transcribe/transcribe.sh"' >> ~/.zshrc
source ~/.zshrc
```

這樣就可以直接用 `transcribe` 指令了！
