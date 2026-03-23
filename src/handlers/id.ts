/**
 * /id command handler - shows Chat ID, Thread ID, and Topic info
 */

import type { Context } from "grammy";
import { getTopicInfo, getTopicIdentifier, getSessionPath } from "../topics";

export async function handleId(ctx: Context): Promise<void> {
  const topicInfo = getTopicInfo(ctx);
  const topicId = getTopicIdentifier(topicInfo);
  const sessionPath = getSessionPath(topicInfo.chatId, topicInfo.threadId);

  let message = "📋 **Chat Information**\n\n";
  message += `**Chat ID**: \`${topicInfo.chatId}\`\n`;
  message += `**Thread ID**: \`${topicInfo.threadId}\`\n`;
  
  if (topicInfo.threadId === 0) {
    message += `**Type**: Private chat or main group chat\n`;
  } else {
    message += `**Type**: Topic in group\n`;
    if (topicInfo.title) {
      message += `**Topic Name**: ${topicInfo.title}\n`;
    }
  }
  
  message += `\n**Session Path**:\n\`${sessionPath}\`\n`;
  message += `\n**Identifier**: ${topicId}`;

  await ctx.reply(message, { parse_mode: "Markdown" });
}
