# Changelog

## [1.0.3] - 2026-03-24

### 🚀 重大升級

#### SDK 版本升級（解決並發崩潰）
- ⬆️ **升級 Claude Agent SDK** - `0.1.76` → `0.2.81` (跨越 105 個版本！)
  - 修復 "API Error: 400 due to tool use concurrency issues" 崩潰
  - 修復 WebFetch 工具執行時崩潰
  - 修復多工具並發調用失敗
  - 修復 Claude Code 進程意外退出 (exit code 1)
  - 改進錯誤處理和恢復機制
  - 更好的性能和穩定性

- 📚 **添加 SDK 升級文檔** - `SDK_UPGRADE_FIX.md`
  - 詳細的問題診斷
  - 完整的升級步驟
  - 測試驗證方法
  - 故障排除指南

**受影響**: 所有用戶
**優先級**: 🔴 緊急 - 核心功能無法使用
**升級方式**: `git pull && rm -rf node_modules bun.lockb && bun install`

---

## [1.0.2] - 2026-03-24

### 🔧 Critical Hotfix

#### 完整修復所有硬編碼路徑
- 🐛 **修復 session.ts:254** - 移除 contextReminder 中的硬編碼路徑
  - 每 10 條消息時注入的提醒不再包含硬編碼路徑
  - 改為使用環境變量 `MEMORY_FILE_PATH`（可選）

- 🐛 **修復 index.ts:104-113** - 移除啟動時的硬編碼文件列表
  - 刪除所有 piggyx 專用的 memory 文件路徑
  - 改為檢查環境變量配置，提供清晰狀態信息

- 📚 **添加完整修復文檔** - `CRITICAL_FIXES.md`
  - 詳細的問題分析和根本原因
  - 完整的修改步驟（附行號）
  - 修改前後對比代碼
  - 測試驗證和部署建議

**受影響**: 所有用戶（特別是非原作者系統）
**優先級**: 🔴 緊急 - 導致核心功能完全崩潰
**修復數量**: 3 處硬編碼路徑（全部修復）

---

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
