/**
 * Claude Telegram Bot - TypeScript/Bun Edition
 *
 * Control Claude Code from your phone via Telegram.
 */

import { Bot } from "grammy";
import { run, sequentialize } from "@grammyjs/runner";
import { TELEGRAM_TOKEN, WORKING_DIR, ALLOWED_USERS, RESTART_FILE } from "./config";
import { unlinkSync, readFileSync, existsSync } from "fs";
import {
  handleStart,
  handleNew,
  handleStop,
  handleStatus,
  handleResume,
  handleRestart,
  handleRetry,
  handleStats,
  handleText,
  handleVoice,
  handlePhoto,
  handleDocument,
  handleCallback,
  handleId,
} from "./handlers";
import { logStartup, logShutdown, logError } from "./logger";

// Create bot instance
const bot = new Bot(TELEGRAM_TOKEN);

// Sequentialize non-command messages per user (prevents race conditions)
// Commands bypass sequentialization so they work immediately
bot.use(
  sequentialize((ctx) => {
    // Commands are not sequentialized - they work immediately
    if (ctx.message?.text?.startsWith("/")) {
      return undefined;
    }
    // Messages with ! prefix bypass queue (interrupt)
    if (ctx.message?.text?.startsWith("!")) {
      return undefined;
    }
    // Callback queries (button clicks) are not sequentialized
    if (ctx.callbackQuery) {
      return undefined;
    }
    // Other messages are sequentialized per chat
    return ctx.chat?.id.toString();
  })
);

// ============== Command Handlers ==============

bot.command("start", handleStart);
bot.command("new", handleNew);
bot.command("stop", handleStop);
bot.command("status", handleStatus);
bot.command("resume", handleResume);
bot.command("restart", handleRestart);
bot.command("retry", handleRetry);
bot.command("stats", handleStats);
bot.command("id", handleId);

// ============== Message Handlers ==============

// Text messages
bot.on("message:text", handleText);

// Voice messages
bot.on("message:voice", handleVoice);

// Photo messages
bot.on("message:photo", handlePhoto);

// Document messages
bot.on("message:document", handleDocument);

// ============== Callback Queries ==============

bot.on("callback_query:data", handleCallback);

// ============== Error Handler ==============

bot.catch((err) => {
  console.error("Bot error:", err);
});

// ============== Startup ==============

console.log("=".repeat(50));
console.log("Claude Telegram Bot - TypeScript Edition");
console.log("=".repeat(50));
console.log(`Working directory: ${WORKING_DIR}`);
console.log(`Allowed users: ${ALLOWED_USERS.length}`);
console.log("Starting bot...");

// Get bot info first
const botInfo = await bot.api.getMe();
console.log(`Bot started: @${botInfo.username}`);

// Auto-load memory on startup
try {
  const memoryFiles = [
    "/Users/heddaai/clawd/piggyx/MEMORY.md",
    "/Users/heddaai/clawd/piggyx/inspiration_library.md",
    "/Users/heddaai/clawd/piggyx/polymarket_research.md",
    "/Users/heddaai/clawd/piggyx/polymarket_small_traders.md",
    "/Users/heddaai/clawd/piggyx/polymarket_tips_summary.md",
    "/Users/heddaai/clawd/piggyx/trading_strategy.md",
    "/Users/heddaai/clawd/kol-database.md",
    "/Users/heddaai/clawd/piggyx/telegram_topics.md",
  ];

  console.log("📖 Loading memory files...");
  for (const file of memoryFiles) {
    if (existsSync(file)) {
      console.log(`  ✓ ${file.split('/').pop()}`);
    }
  }
  console.log("✅ Memory loaded! Ready for Hedda 姐姐 🩵");
} catch (e) {
  console.warn("Memory load failed:", e);
}

// Check for pending restart message to update
if (existsSync(RESTART_FILE)) {
  try {
    const data = JSON.parse(readFileSync(RESTART_FILE, "utf-8"));
    const age = Date.now() - data.timestamp;

    // Only update if restart was recent (within 30 seconds)
    if (age < 30000 && data.chat_id && data.message_id) {
      await bot.api.editMessageText(
        data.chat_id,
        data.message_id,
        "✅ Bot restarted"
      );
    }
    unlinkSync(RESTART_FILE);
  } catch (e) {
    console.warn("Failed to update restart message:", e);
    try { unlinkSync(RESTART_FILE); } catch {}
  }
}

// Start with concurrent runner (commands work immediately)
// Add retry policy for network errors
let runner = run(bot, {
  runner: {
    fetch: {
      retries: 10, // Retry 10 times on network errors (increased from 5)
      retryDelay: 3000, // Wait 3 seconds between retries (increased from 2)
    },
  },
});

// Infinite auto-restart on runner crash (network issues)
let restartAttempts = 0;
const maxRestartDelay = 60000; // Max 60 seconds between restarts
let isRestarting = false; // Prevent multiple simultaneous restarts

function attachCrashHandler() {
  runner.task().catch(async (error) => {
    // Prevent multiple restart attempts
    if (isRestarting) {
      console.log("⏳ Restart already in progress, ignoring this crash...");
      return;
    }

    isRestarting = true;
    restartAttempts++;

    // Special handling for 409 errors (duplicate instance)
    const is409Error = error.message?.includes("409") || error.error_code === 409;

    // For 409 errors, use longer delays to ensure old connection is fully closed
    const baseDelay = is409Error ? 15000 : 5000; // 15s for 409, 5s for others
    const delay = Math.min(baseDelay * Math.pow(2, restartAttempts - 1), maxRestartDelay);

    console.error(`[${new Date().toISOString()}] Runner crashed (attempt #${restartAttempts}):`, error.message || error);

    if (is409Error) {
      console.log("⚠️  Detected 409 conflict - ensuring previous connection is closed...");
    }

    console.log(`Restarting bot in ${delay / 1000} seconds...`);

    // Gracefully stop the current runner first
    try {
      if (runner.isRunning()) {
        console.log("🛑 Stopping current runner...");
        runner.stop();
        // Wait for runner to fully stop
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("✅ Current runner stopped");
      }
    } catch (err) {
      console.warn("⚠️  Error stopping runner:", err);
    }

    setTimeout(async () => {
      console.log(`[${new Date().toISOString()}] Restarting runner (attempt #${restartAttempts})...`);

      try {
        // Wait a bit more before creating new runner (ensure old connections are closed)
        await new Promise(resolve => setTimeout(resolve, 1000));

        runner = run(bot, {
          runner: {
            fetch: {
              retries: 10,
              retryDelay: 3000,
            },
          },
        });

        // Re-attach crash handler (infinite loop)
        attachCrashHandler();

        // Reset counter and flag on successful restart
        console.log("✅ Runner restarted successfully");
        restartAttempts = 0;
        isRestarting = false;
      } catch (err) {
        console.error("❌ Failed to restart runner:", err);
        isRestarting = false;
        // Will retry again with exponential backoff
        attachCrashHandler();
      }
    }, delay);
  });
}

// Start the crash handler
attachCrashHandler();

// Graceful shutdown
const stopRunner = () => {
  if (runner.isRunning()) {
    console.log("Stopping bot...");
    runner.stop();
  }
};

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  logShutdown("SIGINT received (Ctrl+C)");
  stopRunner();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  logShutdown("SIGTERM received");
  stopRunner();
  process.exit(0);
});

// Log uncaught exceptions
process.on("uncaughtException", (error) => {
  logError(error, "uncaughtException");
  logShutdown("Crashed due to uncaught exception");
  process.exit(1);
});

// Log startup
logStartup();
