# Changelog

## [1.0.1] - 2026-03-24

### 🔧 Hotfix

#### 修復關鍵崩潰問題
- 🐛 **移除硬編碼記憶路徑** - 修復 Claude Code 進程崩潰 (exit code 1)
  - 移除 `/Users/heddaai/clawd/piggyx/MEMORY.md` 硬編碼路徑
  - 改為使用環境變量 `MEMORY_FILE_PATH`（可選）
  - 防止在其他系統上運行時崩潰
  - 修復工具執行（WebFetch、Bash 等）時的崩潰問題

#### 配置更新
- 📝 在 `.env.example` 添加 `MEMORY_FILE_PATH` 選項
- 📚 添加 `HOTFIX-2024-03-24.md` 文檔

**受影響**: 所有在非原作者系統上運行的用戶
**優先級**: 🔴 高 - 導致核心功能崩潰

---

## [1.0.0] - 2026-03-24

### ✨ 首次发布

基于 [@linuz90/claude-telegram-bot](https://github.com/linuz90/claude-telegram-bot) 的进化版本

### 🎯 核心改进

#### 修复
- ✅ **修复工具并发调用错误** - 解决 "API Error: 400 due to tool use concurrency issues"
- ✅ **优化错误恢复** - 指数退避重启机制
- ✅ **改进会话管理** - 更稳定的会话持久化

#### 新功能
- ✨ **Topics 支持** - Telegram 群组 Topics 独立会话
- ✨ **记忆系统** - 自动加载和管理记忆文件
- ✨ **中断支持** - 使用 `!` 前缀立即停止查询
- ✨ **流式状态显示** - 实时显示工具使用状态
- ✨ **互动式安装** - 友好的配置向导

#### 增强
- 🔧 **更好的错误提示** - 清晰的错误信息和解决建议
- 🔧 **完整审计日志** - 所有操作可追溯
- 🔧 **优化性能** - 降低内存占用和响应延迟
- 🔧 **macOS 优化** - 专为 Mac 用户优化

### 📦 包含内容

- 🎯 完整的 Claude Code 集成
- 🛠️ 273+ Claude Skills
- 🔒 完善的安全机制
- 📚 详细的文档和指南
- 🚀 生产级部署配置

### 🔐 安全增强

- 用户白名单机制
- 路径访问控制
- 命令安全检查
- 速率限制
- 审计日志

### 📝 文档

- 完整的 README
- 互动式安装指南
- 故障排除文档
- 安全最佳实践

---

## [Original] - linuz90/claude-telegram-bot

基于原始项目的功能：
- 基本的 Telegram Bot 功能
- Claude Code 集成
- 多媒体处理
- 基础安全机制

详见：https://github.com/linuz90/claude-telegram-bot
