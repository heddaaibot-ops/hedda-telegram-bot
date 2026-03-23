# Telegram Send File

Send files to Telegram groups directly from the command line.

## Setup

No setup needed. Uses existing Telegram bot configuration from Pimi.

## Usage

```bash
./send.js <file_path> [caption] [--chat CHAT_ID]
```

### Examples

```bash
# Send to Pimi main group (default)
./send.js ~/Desktop/report.pdf "今日報告"

# Send to specific group
./send.js data.xlsx "數據分析" --chat -4841789940

# Send screenshot
./send.js screenshot.png "截圖說明"
```

## Available Chat IDs

- `-1003777551615` - Pimi 主群 (default)
- `-4841789940` - 新幣小分隊（團隊投研群）
- `-1002064535341` - Piggy House（公開大群）

## When to Use

- User asks to send a file to Telegram
- Need to share reports, images, or documents
- Upload files from Desktop, Downloads, or any directory
- No OpenClaw directory restrictions

## Output

Shows:
- File name and size
- Target group
- Success confirmation with message ID
