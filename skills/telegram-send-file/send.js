#!/usr/bin/env node

/**
 * Telegram 檔案發送工具（使用 curl，無需額外依賴）
 *
 * 使用方式：
 * node send-telegram-file.js <檔案路徑> [訊息文字] [--chat CHAT_ID]
 *
 * 範例：
 * node send-telegram-file.js /path/to/file.pdf "這是PDF檔案"
 * node send-telegram-file.js report.xlsx "最新報告" --chat -1003777551615
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 從 config 讀取設定
const CONFIG_PATH = path.join(process.env.HOME, 'clawd/pimi-reports/crypto-news-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const TELEGRAM_BOT_TOKEN = config.telegramBotToken;
const DEFAULT_CHAT_ID = config.telegramChatId[0]; // Pimi 主群

// 解析命令列參數
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ 錯誤：請提供檔案路徑');
  console.log('\n使用方式：');
  console.log('  node send-telegram-file.js <檔案路徑> [訊息文字] [--chat CHAT_ID]');
  console.log('\n範例：');
  console.log('  node send-telegram-file.js /path/to/file.pdf "這是PDF檔案"');
  console.log('  node send-telegram-file.js report.xlsx "最新報告" --chat -4841789940');
  console.log('\n可用的 Chat IDs：');
  Object.entries(config.chatIdLabels).forEach(([id, label]) => {
    console.log(`  ${id} - ${label}`);
  });
  process.exit(1);
}

const filePath = args[0];
let caption = '';
let chatId = DEFAULT_CHAT_ID;

// 解析參數
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--chat' && args[i + 1]) {
    chatId = args[i + 1];
    i++;
  } else if (!args[i].startsWith('--')) {
    caption = args[i];
  }
}

// 檢查檔案是否存在
if (!fs.existsSync(filePath)) {
  console.error(`❌ 錯誤：檔案不存在 - ${filePath}`);
  process.exit(1);
}

const fileName = path.basename(filePath);
const fileStats = fs.statSync(filePath);

console.log(`📤 準備發送檔案...`);
console.log(`   檔案：${fileName}`);
console.log(`   大小：${(fileStats.size / 1024).toFixed(2)} KB`);
console.log(`   目標：${config.chatIdLabels[chatId] || chatId}`);
if (caption) console.log(`   說明：${caption}`);

// 使用 curl 發送檔案
const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;

let curlCmd = `curl -s -X POST "${url}" \
  -F "chat_id=${chatId}" \
  -F "document=@${filePath}"`;

if (caption) {
  curlCmd += ` -F "caption=${caption}"`;
}

try {
  const response = execSync(curlCmd, { encoding: 'utf8' });
  const result = JSON.parse(response);

  if (result.ok) {
    console.log('✅ 檔案發送成功！');
    console.log(`   Message ID: ${result.result.message_id}`);
  } else {
    console.error('❌ 發送失敗：', result.description);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ 發送失敗：', err.message);
  process.exit(1);
}
