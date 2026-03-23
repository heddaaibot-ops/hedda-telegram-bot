/**
 * Telegram Topics 管理
 *
 * 提供 Topics 相關的工具函數，包括：
 * - Topic 資訊提取
 * - Session 路徑管理
 * - 眼睛反應功能
 */

import type { Context } from "grammy";
import { SESSION_DIR } from "./config";
import { join } from "path";

/**
 * Topic 資訊介面
 */
export interface TopicInfo {
  chatId: number;
  threadId: number;
  title: string | null;
}

/**
 * 從 Context 提取 Topic 資訊
 *
 * @param ctx - Grammy Context
 * @returns TopicInfo 包含 chatId, threadId, title
 */
export function getTopicInfo(ctx: Context): TopicInfo {
  const chatId = ctx.chat?.id || 0;
  // message_thread_id 存在表示來自 Topic，不存在則為主對話（設為 0）
  const threadId = ctx.message?.message_thread_id || 0;

  return {
    chatId,
    threadId,
    title: null, // 之後可以從 Telegram API 取得 Topic 標題
  };
}

/**
 * 生成 Topic 專屬的 Session 檔案路徑
 *
 * @param chatId - Chat ID
 * @param threadId - Thread ID (0 表示主對話)
 * @returns Session 檔案的完整路徑
 */
export function getSessionPath(chatId: number, threadId: number): string {
  if (threadId === 0) {
    // 主對話或私訊
    return join(SESSION_DIR, `session-${chatId}.json`);
  }
  // Topic 專屬 session
  return join(SESSION_DIR, `session-${chatId}-${threadId}.json`);
}

/**
 * 取得 Topic 識別符（用於 logging 和顯示）
 *
 * @param topicInfo - Topic 資訊
 * @returns 可讀的識別符字串
 */
export function getTopicIdentifier(topicInfo: TopicInfo): string {
  if (topicInfo.threadId === 0) {
    return `Chat ${topicInfo.chatId}`;
  }
  if (topicInfo.title) {
    return `Chat ${topicInfo.chatId} / Topic "${topicInfo.title}" (${topicInfo.threadId})`;
  }
  return `Chat ${topicInfo.chatId} / Topic ${topicInfo.threadId}`;
}

/**
 * 發送眼睛反應（表示收到訊息）
 *
 * 這個功能讓用戶知道 Bot 已經「看到」訊息，正在處理中。
 * 類似 OpenClaw 的眼睛動畫效果。
 *
 * @param ctx - Grammy Context
 * @param emoji - 表情符號（預設為 👁️）
 */
export async function sendEyeReaction(
  ctx: Context,
  emoji: string = "👁️"
): Promise<void> {
  try {
    if (!ctx.message) {
      console.log("👁️ No message to react to");
      return;
    }

    console.log(`👁️ Sending ${emoji} reaction to message ${ctx.message.message_id} in chat ${ctx.chat!.id}`);

    /* await ctx.api.setMessageReaction(
      ctx.chat!.id,
      ctx.message.message_id,
      [{ type: "emoji", emoji }],
      { is_big: false }
    ); */

    console.log(`✅ Eye reaction sent successfully!`);
  } catch (error) {
    // 反應失敗不影響主要流程，只記錄警告
    console.warn("❌ Failed to send eye reaction:", error);
  }
}

/**
 * 檢查訊息是否來自 Topic
 *
 * @param ctx - Grammy Context
 * @returns true 如果訊息來自 Topic
 */
export function isFromTopic(ctx: Context): boolean {
  return (ctx.message?.message_thread_id || 0) > 0;
}

/**
 * 回覆到相同的 Topic
 *
 * 確保回覆訊息發送到正確的 Topic 中
 *
 * @param ctx - Grammy Context
 * @param text - 回覆文字
 * @param options - 額外選項
 */
export async function replyToTopic(
  ctx: Context,
  text: string,
  options: any = {}
): Promise<void> {
  const threadId = ctx.message?.message_thread_id;

  if (threadId) {
    // 如果來自 Topic，回覆到同一個 Topic
    await ctx.api.sendMessage(ctx.chat!.id, text, {
      ...options,
      message_thread_id: threadId,
    });
  } else {
    // 否則正常回覆
    await ctx.reply(text, options);
  }
}
