# GameHub

[English](#english) | [中文](#中文)

---

## English

### Overview

GameHub is a lightweight, browser-based mini-game platform built with React and Vite. It comes pre-loaded with classic games (Snake, Pong) and supports importing custom HTML games for instant playback.

### Features

- **Built-in Games**: Snake and Pong — play immediately without any setup
- **Import Custom Games**: Import any `.html` game file and play it instantly
- **Local Storage**: Imported games persist across browser sessions
- **Responsive Design**: Works on desktop and mobile browsers
- **Modern UI**: Dark theme with Tailwind CSS and smooth animations

### Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Backend**: Express (optional, for production deployment)

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Configuration

Create a `.env.local` file in the project root:

```env
# Gemini API Key (optional, for AI features)
GEMINI_API_KEY=your_api_key_here
```

### Importing Games

1. Click the **"导入游戏 (.html)"** button in the header
2. Select any `.html` file containing a self-contained game
3. The game will appear in the game hall and persist across sessions

### Project Structure

```
gamehub/
├── src/
│   ├── App.tsx       # Main application component
│   ├── games.ts      # Built-in game definitions
│   └── main.tsx      # Entry point
├── components/       # UI components (shadcn/ui)
├── server.js         # Express server (optional)
└── index.html
```

### Browser Compatibility

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

---

## 中文

### 项目简介

GameHub 是一个轻量级的浏览器端小游戏平台，使用 React 和 Vite 构建。平台内置了经典游戏（贪吃蛇、弹球），并支持导入自定义 HTML 游戏文件即时运行。

### 功能特点

- **内置游戏**：贪吃蛇、弹球 — 无需配置即可游玩
- **导入游戏**：导入任意 `.html` 格式的游戏文件，即时运行
- **本地存储**：导入的游戏会在浏览器会话间持久保存
- **响应式布局**：适配桌面端和移动端浏览器
- **现代化 UI**：深色主题，Tailwind CSS 样式，流畅动画

### 技术栈

- **前端框架**: React 19, TypeScript
- **构建工具**: Vite 6
- **样式方案**: Tailwind CSS 4, shadcn/ui
- **后端服务**: Express（可选，用于生产环境部署）

### 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 环境配置

在项目根目录创建 `.env.local` 文件：

```env
# Gemini API 密钥（可选，用于 AI 功能）
GEMINI_API_KEY=your_api_key_here
```

### 导入游戏

1. 点击顶部导航栏的 **"导入游戏 (.html)"** 按钮
2. 选择任意包含独立游戏的 `.html` 文件
3. 游戏将出现在游戏大厅，并在后续访问中持久保存

### 项目结构

```
gamehub/
├── src/
│   ├── App.tsx       # 主应用组件
│   ├── games.ts      # 内置游戏定义
│   └── main.tsx      # 入口文件
├── components/       # UI 组件（shadcn/ui）
├── server.js        # Express 服务器（可选）
└── index.html
```

### 浏览器兼容性

| 浏览器 | 版本   |
|--------|--------|
| Chrome | 90+    |
| Firefox| 88+    |
| Safari | 14+    |
| Edge   | 90+    |

---

## License | 许可证

MIT License — see [LICENSE](LICENSE) file for details.

MIT 许可证 — 详情请参阅 [LICENSE](LICENSE) 文件。
