import type { McpServerConfig } from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP 服务器配置示例
 *
 * 复制此文件为 mcp-config.ts 并根据需要配置
 */

export const MCP_SERVERS: Record<string, McpServerConfig> = {
  // === 内置 MCP 服务器 ===

  // ask-user: 用户交互（按钮选择）
  "ask-user": {
    command: "bun",
    args: ["run", "${REPO_ROOT}/ask_user_mcp/server.ts"],
  },

  // === 第三方 MCP 服务器示例 ===

  // Figma 设计文件访问
  // "figma": {
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-figma"],
  //   env: {
  //     FIGMA_PERSONAL_ACCESS_TOKEN: "your_figma_token_here"
  //   }
  // },

  // GitHub 仓库访问
  // "github": {
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-github"],
  //   env: {
  //     GITHUB_PERSONAL_ACCESS_TOKEN: "your_github_token_here"
  //   }
  // },

  // Google Drive
  // "gdrive": {
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-gdrive"]
  // },

  // Brave Search
  // "brave-search": {
  //   command: "npx",
  //   args: ["-y", "@modelcontextprotocol/server-brave-search"],
  //   env: {
  //     BRAVE_API_KEY: "your_brave_api_key_here"
  //   }
  // },

  // === HTTP MCP 服务器示例 ===

  // Typefully (社交媒体管理)
  // "typefully": {
  //   type: "http",
  //   url: "https://mcp.typefully.com/mcp",
  //   headers: {
  //     "Authorization": "Bearer your_typefully_api_key_here"
  //   }
  // },

  // === 自定义本地 MCP 服务器 ===

  // Python MCP 服务器示例
  // "custom-python": {
  //   command: "uv",
  //   args: ["--directory", "${HOME}/my-mcp-server", "run", "server.py"],
  //   env: {
  //     "CUSTOM_API_KEY": "your_api_key"
  //   }
  // },

  // Node.js MCP 服务器示例
  // "custom-node": {
  //   command: "node",
  //   args: ["${HOME}/my-mcp-server/index.js"]
  // },
};

/**
 * 环境变量替换说明：
 *
 * ${REPO_ROOT} - 项目根目录
 * ${HOME} - 用户主目录
 *
 * 你也可以使用系统环境变量
 */
