# 🚀 快速安装指南

## 给你男朋友的安装说明

嗨！这是 Hedda 为你准备的进化版 Telegram Bot。按照以下步骤安装：

## 📋 前提条件

1. **macOS** (你的 Mac mini)
2. **Bun** 已安装 (如果没有，先安装：`curl -fsSL https://bun.sh/install | bash`)
3. **Claude CLI** 或 Anthropic API Key
4. **Telegram Bot Token** (从 @BotFather 获取)
5. **macOS 权限** ⭐ 重要！

### 🔐 macOS 权限设置

Bot 需要以下权限才能正常工作：

1. **完整磁盘访问权限** - 必需
2. **开发者工具权限** - 必需
3. **网络连接权限** - 必需

**好消息**：安装脚本会自动检测并引导你完成授权！

**快速测试权限**：
```bash
./test-permissions.sh
```

如需详细说明，查看：[MACOS_PERMISSIONS.md](./MACOS_PERMISSIONS.md)

## ⚡ 一键安装

```bash
# 1. Clone 仓库 (Hedda 会给你 GitHub 链接)
git clone [GitHub URL]
cd hedda-telegram-bot

# 2. 运行互动式安装
bun run setup.ts

# 3. 按照提示输入配置
# - Telegram Bot Token
# - 你的 Telegram User ID
# - OpenAI API Key (可选，用于语音)

# 4. 安装完成后启动
bun run src/index.ts
```

## 🎯 获取配置信息

### 1. Telegram Bot Token

1. 在 Telegram 搜索 `@BotFather`
2. 发送 `/newbot`
3. 按提示设置 bot 名称和用户名
4. 复制获得的 token（格式：`123456:ABC-DEF1234...`）

### 2. 你的 Telegram User ID

1. 启动 bot 后
2. 在 Telegram 中搜索你的 bot
3. 发送 `/start`
4. 发送 `/id`
5. Bot 会回复你的 User ID

### 3. OpenAI API Key (可选)

1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API key
3. 复制 key（格式：`sk-...`）

## ✅ 验证安装

安装完成后：

```bash
# 启动 bot
bun run src/index.ts

# 在另一个终端查看日志
tail -f bot.log
```

在 Telegram 中向你的 bot 发送消息，应该会收到回复！

## 🐛 遇到问题？

### Bot 不响应

```bash
# 检查日志
tail -f bot-error.log

# 确认配置
cat .env
```

### API Error: 400

这个版本已经修复了！如果还出现，请检查是否有多个 bot 实例在运行。

### 需要帮助

1. 查看 README.md 获取完整文档
2. 检查 bot-error.log 日志文件
3. 联系 Hedda 🩵

## 🎉 享受你的 AI 助手！

安装完成后，你就有了一个强大的 Claude Code 助手在 Telegram 上！

- 发送文本消息进行对话
- 发送图片让 Claude 分析
- 发送语音消息（如果配置了 OpenAI）
- 发送文档进行处理

试试发送：`帮我写一个 Python 脚本`

---

**Made with ❤️ by Hedda for her boyfriend**
