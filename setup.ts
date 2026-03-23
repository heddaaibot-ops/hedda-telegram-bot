#!/usr/bin/env bun
/**
 * Hedda Telegram Bot - 互动式安装脚本
 *
 * 这个脚本会引导你完成 bot 的配置和安装
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// 颜色输出
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function print(message: string, color: keyof typeof colors = "reset") {
  console.log(colors[color] + message + colors.reset);
}

function printHeader(message: string) {
  console.log("");
  print("═".repeat(60), "cyan");
  print(`  ${message}`, "bright");
  print("═".repeat(60), "cyan");
  console.log("");
}

function printSuccess(message: string) {
  print(`✅ ${message}`, "green");
}

function printError(message: string) {
  print(`❌ ${message}`, "red");
}

function printWarning(message: string) {
  print(`⚠️  ${message}`, "yellow");
}

function printInfo(message: string) {
  print(`ℹ️  ${message}`, "blue");
}

// 读取用户输入
function prompt(question: string, defaultValue: string = ""): string {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const displayDefault = defaultValue ? ` [${defaultValue}]` : "";
    readline.question(question + displayDefault + ": ", (answer: string) => {
      readline.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// 检查系统要求
async function checkRequirements(): Promise<boolean> {
  printHeader("检查系统要求");

  // 检查 Bun
  try {
    const bunVersion = Bun.version;
    printSuccess(`Bun 已安装: v${bunVersion}`);
  } catch (error) {
    printError("未找到 Bun！请先安装 Bun: https://bun.sh");
    return false;
  }

  // 检查操作系统
  if (process.platform !== "darwin") {
    printWarning("此版本专为 macOS 优化，其他系统可能需要调整配置");
  } else {
    printSuccess("macOS 系统检测通过");
  }

  // 检查 Claude CLI
  try {
    const proc = Bun.spawn(["which", "claude"]);
    const output = await new Response(proc.stdout).text();
    if (output.trim()) {
      printSuccess(`Claude CLI 已安装: ${output.trim()}`);
    } else {
      printWarning("未找到 Claude CLI，将使用 API Key 模式");
    }
  } catch (error) {
    printWarning("无法检查 Claude CLI 状态");
  }

  print("");
  return true;
}

// 配置向导
async function configurationWizard(): Promise<Record<string, string>> {
  printHeader("配置向导");

  const config: Record<string, string> = {};

  // Telegram Bot Token
  print("📱 Telegram 配置", "bright");
  print("   从 @BotFather 创建新的 bot 并获取 token", "dim");
  print("   https://t.me/BotFather", "dim");
  print("");
  config.TELEGRAM_BOT_TOKEN = await prompt("请输入 Telegram Bot Token");

  while (!config.TELEGRAM_BOT_TOKEN) {
    printError("Bot Token 不能为空！");
    config.TELEGRAM_BOT_TOKEN = await prompt("请输入 Telegram Bot Token");
  }

  // User ID
  print("");
  print("👤 用户授权", "bright");
  print("   向你的 bot 发送 /start，然后使用 /id 命令获取你的 User ID", "dim");
  print("   多个用户用逗号分隔：123456789,987654321", "dim");
  print("");
  config.TELEGRAM_ALLOWED_USERS = await prompt("请输入允许的用户 ID");

  while (!config.TELEGRAM_ALLOWED_USERS) {
    printError("至少需要一个用户 ID！");
    config.TELEGRAM_ALLOWED_USERS = await prompt("请输入允许的用户 ID");
  }

  // OpenAI API Key (可选)
  print("");
  print("🎙️  语音转文字（可选）", "bright");
  print("   如果需要语音消息功能，请输入 OpenAI API Key", "dim");
  print("   不需要可直接按 Enter 跳过", "dim");
  print("");
  config.OPENAI_API_KEY = await prompt("OpenAI API Key（可选）", "");

  // 工作目录
  print("");
  print("📁 工作目录", "bright");
  const defaultWorkDir = homedir();
  print(`   Bot 的工作目录，建议使用默认值`, "dim");
  print("");
  config.CLAUDE_WORKING_DIR = await prompt("工作目录", defaultWorkDir);

  return config;
}

// 生成 .env 文件
function generateEnvFile(config: Record<string, string>): void {
  printHeader("生成配置文件");

  const envContent = `# Hedda Telegram Bot Configuration
# Generated on ${new Date().toISOString()}

# === 必需配置 ===
TELEGRAM_BOT_TOKEN=${config.TELEGRAM_BOT_TOKEN}
TELEGRAM_ALLOWED_USERS=${config.TELEGRAM_ALLOWED_USERS}

# === 可选配置 ===
${config.OPENAI_API_KEY ? `OPENAI_API_KEY=${config.OPENAI_API_KEY}` : "# OPENAI_API_KEY="}

CLAUDE_WORKING_DIR=${config.CLAUDE_WORKING_DIR}

# === 速率限制 ===
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW=60

# === 思考模式 ===
DEFAULT_THINKING_TOKENS=10000
THINKING_KEYWORDS=think,pensa,ragiona,思考
THINKING_DEEP_KEYWORDS=ultrathink,think hard,深度思考

# === 高级配置 ===
MEDIA_GROUP_TIMEOUT=1000
STREAMING_THROTTLE_MS=500
QUERY_TIMEOUT_MS=180000
`;

  writeFileSync(".env", envContent);
  printSuccess(".env 文件已创建");
}

// 安装依赖
async function installDependencies(): Promise<void> {
  printHeader("安装依赖");

  printInfo("正在安装 Node.js 依赖...");

  const proc = Bun.spawn(["bun", "install"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;

  if (exitCode === 0) {
    printSuccess("依赖安装完成");
  } else {
    const error = await new Response(proc.stderr).text();
    printError("依赖安装失败:");
    console.log(error);
    throw new Error("Installation failed");
  }
}

// 创建必要的目录
function createDirectories(): void {
  printHeader("创建目录结构");

  const dirs = [
    "/tmp/claude-telegram-sessions",
    "/tmp/telegram-bot",
    join(homedir(), ".claude", "skills"),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      printSuccess(`已创建: ${dir}`);
    } else {
      printInfo(`已存在: ${dir}`);
    }
  }
}

// 复制 skills
async function copySkills(): Promise<void> {
  printHeader("安装 Skills");

  const skillsSource = join(__dirname, "skills");
  const skillsTarget = join(homedir(), ".claude", "skills");

  if (existsSync(skillsSource)) {
    printInfo("正在复制 skills...");
    const proc = Bun.spawn(["cp", "-r", skillsSource + "/", skillsTarget], {
      stdout: "pipe",
    });
    await proc.exited;
    printSuccess("Skills 已安装");
  } else {
    printWarning("未找到 skills 目录，跳过");
  }
}

// 设置 MCP 服务器
function setupMCP(): void {
  printHeader("配置 MCP 服务器");

  const mcpConfig = `import type { McpServerConfig } from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP 服务器配置
 *
 * 支持的服务器类型：
 * 1. Stdio: 本地可执行文件
 * 2. HTTP: 远程 REST API
 */

export const MCP_SERVERS: Record<string, McpServerConfig> = {
  // ask-user: 内置的用户交互 MCP
  "ask-user": {
    command: "bun",
    args: ["run", "\${REPO_ROOT}/ask_user_mcp/server.ts"],
  },

  // 添加你的 MCP 服务器配置
  // 例如：
  // "figma": {
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-figma"],
  //   env: {
  //     FIGMA_PERSONAL_ACCESS_TOKEN: "your_token_here"
  //   }
  // },
};
`;

  writeFileSync("mcp-config.ts", mcpConfig);
  printSuccess("MCP 配置文件已创建");
  printInfo("你可以编辑 mcp-config.ts 添加更多 MCP 服务器");
}

// 创建记忆系统模板
function setupMemory(): void {
  printHeader("配置记忆系统");

  const memoryDir = join(process.cwd(), "memory");
  const dailyLogsDir = join(process.cwd(), "daily-logs");

  if (!existsSync(memoryDir)) {
    mkdirSync(memoryDir, { recursive: true });
  }
  if (!existsSync(dailyLogsDir)) {
    mkdirSync(dailyLogsDir, { recursive: true });
  }

  // 创建 MEMORY.md 模板
  const memoryTemplate = `# 🧠 核心记忆

> 这是你的主记忆文件，存储关于用户的重要信息

## 👤 用户信息

- **姓名**:
- **偏好**:
- **重要日期**:

## 📁 项目记录

## 🎯 待办事项

## 💡 灵感库

`;

  writeFileSync(join(memoryDir, "MEMORY.md"), memoryTemplate);
  printSuccess("记忆系统模板已创建");
}

// 创建 LaunchAgent（可选）
async function setupLaunchAgent(): Promise<void> {
  printHeader("设置开机自启动");

  print("是否要配置 macOS LaunchAgent（开机自启动）？", "bright");
  const answer = await prompt("(y/n)", "n");

  if (answer.toLowerCase() !== "y") {
    printInfo("跳过 LaunchAgent 配置");
    return;
  }

  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.hedda.telegram-bot</string>
    <key>ProgramArguments</key>
    <array>
        <string>${Bun.which("bun")}</string>
        <string>run</string>
        <string>${join(process.cwd(), "src/index.ts")}</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${process.cwd()}</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>${join(process.cwd(), "bot.log")}</string>
    <key>StandardErrorPath</key>
    <string>${join(process.cwd(), "bot-error.log")}</string>
</dict>
</plist>`;

  const launchAgentPath = join(
    homedir(),
    "Library/LaunchAgents/com.hedda.telegram-bot.plist"
  );

  writeFileSync(launchAgentPath, plistContent);
  printSuccess(`LaunchAgent 已创建: ${launchAgentPath}`);

  print("");
  printInfo("启动 bot:");
  console.log(`  launchctl load ~/Library/LaunchAgents/com.hedda.telegram-bot.plist`);
  print("");
  printInfo("停止 bot:");
  console.log(`  launchctl unload ~/Library/LaunchAgents/com.hedda.telegram-bot.plist`);
}

// 显示完成信息
function showCompletionMessage(): void {
  printHeader("🎉 安装完成！");

  print("", "green");
  printSuccess("Hedda Telegram Bot 已成功安装并配置！");
  print("");

  printInfo("启动 bot:");
  console.log("  bun run src/index.ts");
  print("");

  printInfo("开发模式（自动重载）:");
  console.log("  bun run --watch src/index.ts");
  print("");

  printInfo("发送消息到你的 bot:");
  console.log("  1. 在 Telegram 中搜索你的 bot");
  console.log("  2. 发送 /start 开始对话");
  console.log("  3. 发送 /id 获取你的 User ID（如果还没配置）");
  print("");

  printInfo("查看文档:");
  console.log("  cat README.md");
  print("");

  print("═".repeat(60), "cyan");
  print("  享受你的智能助手！🤖", "bright");
  print("═".repeat(60), "cyan");
  print("");
}

// 主流程
async function main() {
  print("");
  print("  ██╗  ██╗███████╗██████╗ ██████╗  █████╗ ", "magenta");
  print("  ██║  ██║██╔════╝██╔══██╗██╔══██╗██╔══██╗", "magenta");
  print("  ███████║█████╗  ██║  ██║██║  ██║███████║", "magenta");
  print("  ██╔══██║██╔══╝  ██║  ██║██║  ██║██╔══██║", "magenta");
  print("  ██║  ██║███████╗██████╔╝██████╔╝██║  ██║", "magenta");
  print("  ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═════╝ ╚═╝  ╚═╝", "magenta");
  print("", "magenta");
  print("  Telegram Bot - 互动式安装程序", "bright");
  print("");

  try {
    // 1. 检查系统要求
    const requirementsMet = await checkRequirements();
    if (!requirementsMet) {
      process.exit(1);
    }

    // 2. 配置向导
    const config = await configurationWizard();

    // 3. 生成配置文件
    generateEnvFile(config);

    // 4. 安装依赖
    await installDependencies();

    // 5. 创建目录
    createDirectories();

    // 6. 复制 skills
    await copySkills();

    // 7. 设置 MCP
    setupMCP();

    // 8. 设置记忆系统
    setupMemory();

    // 9. 设置 LaunchAgent（可选）
    await setupLaunchAgent();

    // 10. 显示完成信息
    showCompletionMessage();

  } catch (error) {
    print("");
    printError("安装过程中出现错误:");
    console.error(error);
    process.exit(1);
  }
}

// 运行安装程序
main();
