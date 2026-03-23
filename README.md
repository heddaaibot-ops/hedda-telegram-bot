# 🤖 Hedda Telegram Bot

> **进化版 Claude Telegram Bot** - 基于 Claude Agent SDK 的智能个人助手

将 Claude Code 的强大能力带到你的 Telegram，随时随地使用 AI 助手！

## ✨ 特性

### 🎯 核心功能
- ✅ **完整的 Claude Code 集成** - 所有工具和能力
- ✅ **多媒体支持** - 文本、语音、图片、PDF、文档
- ✅ **流式响应** - 实时查看 Claude 的思考和工具使用
- ✅ **会话管理** - 持久化对话，支持多 Topic
- ✅ **记忆系统** - 自动加载和管理记忆文件
- ✅ **273+ Skills** - 预装所有 Claude Code skills

### 🛡️ 安全机制
- 🔒 用户白名单 - 只有授权用户可使用
- 🔒 路径验证 - 防止访问敏感文件
- 🔒 命令安全检查 - 阻止危险命令
- 🔒 速率限制 - 防止滥用
- 📝 完整审计日志 - 所有操作可追溯

### 🚀 进化改进
相比原版 `claude-telegram-bot`：
- ✅ **修复工具并发调用** - 解决 API Error 400
- ✅ **指数退避重启** - 更稳定的运行
- ✅ **Topics 支持** - 每个话题独立会话
- ✅ **记忆系统集成** - 自动加载核心记忆
- ✅ **优化错误处理** - 更好的错误恢复
- ✅ **中断支持** - `!` 前缀立即停止
- ✅ **流式状态** - 工具使用实时反馈

## 📦 安装

### 系统要求

- **macOS** (专为 Mac 优化)
- **Bun** 1.0+ (JavaScript 运行时)
- **Claude CLI** (推荐) 或 Anthropic API Key

### 快速开始

```bash
# 1. Clone 仓库
git clone https://github.com/YOUR_USERNAME/hedda-telegram-bot.git
cd hedda-telegram-bot

# 2. 运行互动式安装
bun run setup.ts

# 3. 启动 bot
./start.sh
# 或者直接用 bun
bun run src/index.ts
```

### 安装过程

互动式安装会引导你完成：

1. ✅ 检查系统要求（Bun、Claude CLI）
2. 🔑 配置 Telegram Bot Token
3. 👤 设置授权用户 ID
4. 🎙️ 配置 OpenAI API Key（可选，用于语音）
5. 📦 安装依赖
6. 🛠️ 配置 MCP 服务器
7. 🧠 设置记忆系统
8. 🚀 配置开机自启动（可选）

## 🎮 使用指南

### 基本命令

| 命令 | 功能 |
|------|------|
| `/start` | 开始对话，显示欢迎信息 |
| `/new` | 开始新会话（清除历史）|
| `/stop` | 停止当前正在运行的查询 |
| `/status` | 查看 bot 状态 |
| `/resume` | 恢复之前的会话 |
| `/stats` | 查看 token 使用统计 |
| `/id` | 获取你的 Telegram User ID |

### 特殊功能

#### 💭 思考模式

在消息中包含关键词触发深度思考：

```
think: 为什么天空是蓝色的？
ultrathink: 解释量子力学的核心概念
```

#### ❗ 中断执行

在消息前加 `!` 立即停止当前查询：

```
! 停止
```

#### 🎙️ 语音消息

直接发送语音消息，自动转文字后处理（需要 OpenAI API Key）

#### 📸 图片处理

- 发送单张图片或相册
- 支持带标题的图片
- Claude 可以分析图片内容

#### 📄 文档处理

支持的文件类型：
- PDF（自动提取文本）
- 文本文件（.md, .txt, .json, .yaml等）
- 压缩包（.zip, .tar, .tar.gz）

### Topics 支持

在 Telegram 群组中使用 Topics 功能，每个 Topic 有独立的对话历史。

## 🔧 配置

### 环境变量

主要配置在 `.env` 文件：

```bash
# 必需
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ALLOWED_USERS=123456789,987654321

# 可选
OPENAI_API_KEY=sk-...
CLAUDE_WORKING_DIR=$HOME

# 速率限制
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW=60
```

### MCP 服务器

编辑 `mcp-config.ts` 添加自定义 MCP 服务器：

```typescript
export const MCP_SERVERS = {
  "figma": {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-figma"],
    env: {
      FIGMA_PERSONAL_ACCESS_TOKEN: "your_token"
    }
  },
  // 添加更多...
};
```

### 记忆系统

Bot 会在启动时自动加载 `memory/MEMORY.md`，你可以：

1. 在 `memory/` 目录添加记忆文件
2. 在 `MEMORY.md` 中记录用户偏好和重要信息
3. Bot 会在对话中自动引用这些信息

## 📁 项目结构

```
hedda-telegram-bot/
├── src/                      # 源代码
│   ├── index.ts             # 主程序
│   ├── session.ts           # Claude 会话管理
│   ├── security.ts          # 安全机制
│   └── handlers/            # 消息处理器
├── skills/                   # 273+ Claude skills
├── memory/                   # 记忆系统
│   └── MEMORY.md           # 核心记忆文件
├── ask_user_mcp/            # ask-user MCP 服务器
├── .env                     # 配置文件（安装时生成）
├── mcp-config.ts           # MCP 服务器配置
├── setup.ts                # 互动式安装脚本
└── README.md               # 本文件
```

## 🚀 部署

### 开发模式

```bash
# 监视模式（代码改动自动重启）
bun run --watch src/index.ts

# 或使用启动脚本
./start.sh
```

### 生产模式 - 保持在线

Bot 具备三层保护机制确保持续运行：

#### 1. 内置自动重启（指数退避）

Bot 自带崩溃恢复机制：
- ✅ 自动检测异常退出
- ✅ 指数退避重启：5s → 10s → 20s → 60s（最大）
- ✅ 无限重试直到成功
- ✅ 特殊处理 409 错误（多实例冲突）

**无需额外配置，开箱即用！**

#### 2. macOS LaunchAgent（推荐）

安装时可选择配置 LaunchAgent，实现：
- 🚀 开机自动启动
- 🔄 进程崩溃自动重启
- 📝 系统级日志管理

```bash
# 启动服务
launchctl load ~/Library/LaunchAgents/com.hedda.telegram-bot.plist

# 停止服务
launchctl unload ~/Library/LaunchAgents/com.hedda.telegram-bot.plist

# 查看状态
launchctl list | grep hedda

# 查看日志
tail -f bot.log
tail -f bot-error.log
```

#### 3. 手动使用 PM2（可选）

如需更高级的进程管理：

```bash
# 安装 PM2
npm install -g pm2

# 启动 bot
pm2 start "bun run src/index.ts" --name hedda-bot

# 保存配置（开机自启动）
pm2 save
pm2 startup

# 管理命令
pm2 list          # 查看所有进程
pm2 logs hedda-bot # 查看日志
pm2 restart hedda-bot # 重启
pm2 stop hedda-bot    # 停止
```

### 健康监控

Bot 提供多种方式监控运行状态：

```bash
# 1. Telegram 命令
/status   # 查看 bot 状态、会话信息、运行时间
/stats    # 查看 token 使用情况、内存占用

# 2. 日志文件
tail -f logs/activity.log   # 活动日志（JSON 格式）
tail -f bot.log            # 标准输出日志
tail -f bot-error.log      # 错误日志

# 3. 审计日志
tail -f /tmp/claude-telegram-audit.log  # 所有操作审计
```

### Docker 部署

```dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY . .
RUN bun install

# 创建日志目录
RUN mkdir -p logs

CMD ["bun", "run", "src/index.ts"]
```

```bash
# 构建镜像
docker build -t hedda-bot .

# 运行容器（自动重启）
docker run -d \
  --name hedda-bot \
  --restart unless-stopped \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/memory:/app/memory \
  -v $(pwd)/logs:/app/logs \
  hedda-bot

# 查看日志
docker logs -f hedda-bot
```

## 🐛 故障排除

### Bot 不响应

1. 检查 `.env` 文件是否正确配置
2. 确认你的 User ID 在 `TELEGRAM_ALLOWED_USERS` 中
3. 查看日志：`tail -f bot-error.log`

### API Error: 400 (tool concurrency)

这个版本已经修复了工具并发调用问题。如果仍然出现：
- 确保使用最新版本代码
- 检查是否有多个 bot 实例运行

### 语音转文字失败

1. 确认设置了 `OPENAI_API_KEY`
2. 检查 API key 是否有效
3. 查看余额是否充足

### 会话丢失

会话文件保存在 `/tmp/claude-telegram-sessions/`：
- 检查目录是否存在
- 确认有写入权限
- 使用 `/resume` 命令恢复

## 📊 性能

- **启动时间**: ~2-3 秒
- **响应延迟**: 1-2 秒（首次 token）
- **内存占用**: ~100-200 MB
- **CPU 使用**: 空闲 <5%，处理时 20-40%

## 🔒 安全建议

1. ⚠️  **不要分享 `.env` 文件** - 包含敏感 tokens
2. ⚠️  **限制授权用户** - 只添加信任的用户 ID
3. ⚠️  **定期检查审计日志** - `/tmp/claude-telegram-audit.log`
4. ⚠️  **备份重要数据** - 定期备份 memory/ 目录
5. ⚠️  **更新依赖** - `bun update` 保持最新

## 🤝 贡献

欢迎贡献！请：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. Push 到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📜 许可

MIT License - 详见 [LICENSE](LICENSE)

## 🙏 致谢

- 基于 [@linuz90/claude-telegram-bot](https://github.com/linuz90/claude-telegram-bot)
- 使用 [@anthropic-ai/claude-agent-sdk](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- Telegram Bot 库：[grammY](https://grammy.dev/)

## 📞 支持

- 📖 [完整文档](docs/)
- 💬 [Issues](https://github.com/YOUR_USERNAME/hedda-telegram-bot/issues)
- 📧 Email: your-email@example.com

---

**Made with ❤️ by Hedda**

🤖 Powered by Claude Code & Anthropic SDK
