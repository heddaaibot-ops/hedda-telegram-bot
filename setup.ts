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

// 检查和引导 macOS 权限
async function checkMacOSPermissions(): Promise<void> {
  printHeader("检查 macOS 权限");

  if (process.platform !== "darwin") {
    printInfo("非 macOS 系统，跳过权限检查");
    return;
  }

  printInfo("Bot 需要以下权限才能正常工作：");
  console.log("");

  // 1. 检查完整磁盘访问权限
  print("1️⃣  完整磁盘访问权限", "bright");
  print("   允许 Bot 访问所有文件和目录", "dim");

  // 尝试访问受保护的目录来测试权限
  const testPaths = [
    join(homedir(), "Library/Application Support"),
    join(homedir(), "Documents"),
    join(homedir(), "Desktop"),
  ];

  let hasFullDiskAccess = true;
  for (const testPath of testPaths) {
    try {
      if (existsSync(testPath)) {
        // 尝试列出目录
        const proc = Bun.spawn(["ls", testPath], {
          stdout: "pipe",
          stderr: "pipe",
        });
        await proc.exited;
        if (proc.exitCode !== 0) {
          hasFullDiskAccess = false;
          break;
        }
      }
    } catch (error) {
      hasFullDiskAccess = false;
      break;
    }
  }

  if (hasFullDiskAccess) {
    printSuccess("已授予完整磁盘访问权限");
  } else {
    printWarning("未检测到完整磁盘访问权限");
    print("");
    print("   需要手动授权：", "yellow");
    print("   1. 打开「系统设置」→「隐私与安全性」→「完整磁盘访问权限」", "dim");
    print("   2. 点击「+」按钮", "dim");
    print("   3. 添加你正在使用的终端应用：", "dim");
    print("      - Terminal.app: /Applications/Utilities/Terminal.app", "dim");
    print("      - iTerm.app: /Applications/iTerm.app", "dim");
    print("      - Warp.app: /Applications/Warp.app", "dim");
    print("   4. 重启终端应用", "dim");
    print("");

    const shouldContinue = await prompt("是否已完成授权？(y/n)", "n");
    if (shouldContinue.toLowerCase() !== "y") {
      printWarning("请完成授权后重新运行安装脚本");
      process.exit(0);
    }
  }

  console.log("");

  // 2. 检查开发者工具权限
  print("2️⃣  开发者工具", "bright");
  print("   允许终端执行命令和脚本", "dim");

  try {
    // 测试是否可以执行 bash 命令
    const proc = Bun.spawn(["bash", "-c", "echo test"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    await proc.exited;

    if (proc.exitCode === 0) {
      printSuccess("Bash 命令执行权限正常");
    } else {
      printWarning("Bash 命令执行可能受限");
    }
  } catch (error) {
    printError("无法执行 Bash 命令");
    print("");
    print("   可能需要：", "yellow");
    print("   1. 打开「系统设置」→「隐私与安全性」→「开发者工具」", "dim");
    print("   2. 确保你的终端应用在列表中", "dim");
    print("");
  }

  console.log("");

  // 3. 检查网络权限
  print("3️⃣  网络连接", "bright");
  print("   允许 Bot 连接 Telegram 和 Claude API", "dim");

  try {
    // 测试网络连接
    const testUrl = "https://api.telegram.org";
    const response = await fetch(testUrl, { method: "HEAD" });
    if (response.ok || response.status === 401) {
      printSuccess("网络连接正常");
    } else {
      printWarning("网络连接可能受限");
    }
  } catch (error) {
    printWarning("无法测试网络连接，可能需要：");
    print("   - 检查防火墙设置", "dim");
    print("   - 确保终端应用可以访问网络", "dim");
  }

  console.log("");

  // 4. 文件权限检查
  print("4️⃣  文件读写权限", "bright");
  print("   允许 Bot 创建和修改文件", "dim");

  try {
    // 创建测试目录
    const testDir = join(process.cwd(), ".test-permissions");
    mkdirSync(testDir, { recursive: true });

    // 测试写入文件
    const testFile = join(testDir, "test.txt");
    writeFileSync(testFile, "test");

    // 测试读取文件
    const content = readFileSync(testFile, "utf-8");

    // 清理测试文件
    const rmProc = Bun.spawn(["rm", "-rf", testDir]);
    await rmProc.exited;

    if (content === "test") {
      printSuccess("文件读写权限正常");
    }
  } catch (error) {
    printError("文件读写权限不足");
    print("   请确保当前用户对项目目录有读写权限", "dim");
  }

  console.log("");

  // 5. 提供快捷方式打开系统设置
  print("💡 快速访问系统设置", "bright");
  const openSettings = await prompt("是否打开「隐私与安全性」设置？(y/n)", "n");

  if (openSettings.toLowerCase() === "y") {
    try {
      // 打开隐私与安全性设置
      Bun.spawn(["open", "x-apple.systempreferences:com.apple.preference.security?Privacy"]);
      printSuccess("已打开系统设置，请检查权限配置");
      print("");
      printWarning("请在完成权限设置后按 Enter 继续...");
      await prompt("");
    } catch (error) {
      printWarning("无法自动打开系统设置，请手动打开");
    }
  }

  console.log("");
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

    // 2. 检查 macOS 权限
    await checkMacOSPermissions();

    // 3. 配置向导
    const config = await configurationWizard();

    // 4. 生成配置文件
    generateEnvFile(config);

    // 5. 安装依赖
    await installDependencies();

    // 6. 创建目录
    createDirectories();

    // 7. 复制 skills
    await copySkills();

    // 8. 设置 MCP
    setupMCP();

    // 9. 设置记忆系统
    setupMemory();

    // 10. 设置 LaunchAgent（可选）
    await setupLaunchAgent();

    // 11. 显示完成信息
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
