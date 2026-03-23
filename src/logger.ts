import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";

// 使用環境變量或項目根目錄
const LOG_DIR = process.env.LOG_DIR || resolve(process.cwd(), "logs");
const LOG_FILE = `${LOG_DIR}/activity.log`;

// 確保日誌目錄存在
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

// 獲取當前時間戳
function getTimestamp(): string {
  return new Date().toISOString();
}

// 通用日誌記錄函數
function writeLog(level: string, message: string, details?: Record<string, unknown>): void {
  const timestamp = getTimestamp();
  const logEntry = {
    timestamp,
    level,
    message,
    ...details,
  };
  
  try {
    appendFileSync(LOG_FILE, JSON.stringify(logEntry) + "\n");
  } catch (error) {
    // 日誌寫入失敗不應該影響主程序
    console.error("Failed to write log:", error);
  }
}

// 記錄收到的消息
export function logMessage(
  chatId: number | undefined,
  username: string | undefined,
  type: string,
  content: string
): void {
  // 只記錄前 100 字符，避免敏感信息洩露
  const preview = content?.substring(0, 100) || "";
  
  writeLog("MESSAGE", `Received ${type} message`, {
    chatId,
    username,
    type,
    preview,
    length: content?.length || 0,
  });
}

// 記錄執行的命令
export function logCommand(
  chatId: number | undefined,
  username: string | undefined,
  command: string,
  args?: string
): void {
  writeLog("COMMAND", `Executed command: ${command}`, {
    chatId,
    username,
    command,
    args: args?.substring(0, 100),
  });
}

// 記錄工具調用
export function logToolCall(
  toolName: string,
  params: Record<string, unknown>,
  success: boolean,
  duration?: number
): void {
  writeLog("TOOL", `Tool call: ${toolName}`, {
    toolName,
    params: JSON.stringify(params).substring(0, 200),
    success,
    duration,
  });
}

// 記錄錯誤
export function logError(error: Error | unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  writeLog("ERROR", `Error in ${context}`, {
    context,
    error: errorMessage,
    stack: errorStack?.substring(0, 500),
  });
}

// 記錄啟動
export function logStartup(): void {
  writeLog("STARTUP", "Piggyx Bot started", {
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
  });
}

// 記錄關閉
export function logShutdown(reason: string): void {
  writeLog("SHUTDOWN", `Piggyx Bot shutting down: ${reason}`, {
    reason,
    uptime: process.uptime(),
  });
}

// 記錄活動（通用）
export function logActivity(action: string, details?: Record<string, unknown>): void {
  writeLog("ACTIVITY", action, details);
}
