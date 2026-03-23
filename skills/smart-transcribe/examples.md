# 使用範例

## 場景 1：轉錄 YouTube 教學影片

```bash
transcribe "https://youtube.com/watch?v=dQw4w9WgXcQ"
```

**結果：**
- ✅ 自動使用 NotebookLM
- 📝 生成完整逐字稿
- 🎙️ 生成 AI 播客
- 🗺️ 生成思維導圖
- 📊 生成摘要和關鍵重點

---

## 場景 2：轉錄 Twitter 上的短片

```bash
transcribe "https://twitter.com/elonmusk/status/1234567890"
```

**過程：**
```
🐦 偵測到 Twitter/X 影片
→ 使用 faster-whisper (含自動下載)

📥 下載影片...
✓ 下載完成: twitter_video.mp4

🎙️  開始轉錄...
[0.00s -> 2.50s] This is the future of AI...
[2.50s -> 5.00s] We're building something incredible...

✅ 轉錄完成！
🗑️  清理臨時檔案...
   ✓ 已刪除: twitter_video.mp4
```

---

## 場景 3：會議錄音（含說話者識別）

```bash
transcribe meeting.mp4 --diarize
```

**輸出：**
```
[SPEAKER_00] 大家好，今天我們討論新產品的發布計劃
[SPEAKER_01] 我認為應該先做市場調查
[SPEAKER_00] 同意，那我們先看一下數據
[SPEAKER_02] 我這邊準備了一份報告...
```

---

## 場景 4：生成影片字幕

```bash
transcribe video.mp4 --format srt
```

**生成檔案：** `video.srt`

```srt
1
00:00:00,000 --> 00:00:02,500
歡迎來到我們的頻道

2
00:00:02,500 --> 00:00:05,000
今天要介紹一個很棒的工具
```

---

## 場景 5：批次轉錄多個檔案

```bash
# 轉錄目錄下所有 mp4
for file in *.mp4; do
    transcribe "$file" --format txt
done
```

---

## 場景 6：Podcast 轉錄

```bash
transcribe podcast_episode_42.mp3 --language zh
```

**輸出：** `podcast_episode_42.txt`

---

## 場景 7：多語言影片翻譯

```bash
# 自動偵測語言並翻譯成英文
transcribe chinese_video.mp4 --translate
```

---

## 場景 8：即時轉錄直播

```bash
# 先下載直播片段
yt-dlp "https://youtube.com/live/xxxxx" -o live.mp4

# 轉錄
transcribe live.mp4 --diarize
```

---

## 場景 9：搭配其他工具

```bash
# 轉錄後用 AI 總結
transcribe lecture.mp4 --format txt
cat lecture.txt | claude "請總結這段演講的重點"

# 轉錄後翻譯
transcribe english_video.mp4 > transcript.txt
cat transcript.txt | deepseek "翻譯成繁體中文"
```

---

## 實際工作流程

### 內容創作者
```bash
# 1. 轉錄影片
transcribe my_video.mp4 --format srt

# 2. 編輯字幕
# 用字幕編輯器修改 my_video.srt

# 3. 嵌入字幕
ffmpeg -i my_video.mp4 -vf subtitles=my_video.srt output.mp4
```

### 研究人員
```bash
# 1. 下載研討會影片
transcribe "https://youtube.com/watch?v=research_talk"

# 2. NotebookLM 自動分析
# → 得到摘要、關鍵引用、思維導圖

# 3. 整理到筆記
```

### 媒體監測
```bash
# 監測 Twitter 上的重要發言
transcribe "https://twitter.com/important_person/status/xxxxx"

# 快速獲得文字版，便於分析和存檔
```

---

## 錯誤處理

### 檔案不存在
```bash
$ transcribe notfound.mp4
❌ 檔案不存在: notfound.mp4
```

### URL 無效
```bash
$ transcribe "https://invalid-url"
❌ 下載失敗
```

### 中斷處理
按 `Ctrl+C` 中斷時：
```
^C
🗑️  清理臨時檔案...
   ✓ 已刪除: twitter_video.mp4
```

臨時檔案會自動清理，不會留下垃圾！
