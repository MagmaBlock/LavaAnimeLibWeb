# LavaAnimeLibWeb

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMagmaBlock%2FLavaAnimeLibWeb.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FMagmaBlock%2FLavaAnimeLibWeb?ref=badge_shield)

熔岩番剧库 LavaAnimeLib 的前端，当前版本 V2.5。

本项目的 V2 版本仍然是不能自行部署的高耦合程序，自行部署将在正在开发中的 V3 版本中支持。

## 前端技术实现

本项目的（前端）主要使用了以下库：

- [Nuxt](https://nuxt.com/)：一个开箱即用的 Vue 开发环境，提供 SSR、自动导入、跨平台部署、TypeScript 等支持，其还包含了以下框架：
  - [Vite](https://cn.vitejs.dev/)：下一代的前端工具链
  - [Vue.js](https://vuejs.org/)：渐进式 JavaScript 框架
  - [Vue Router](https://router.vuejs.org/)：Vue.js 的官方路由
- [Pinia](https://pinia.vuejs.org/zh/)：符合直觉的 Vue.js 状态管理库
- [NaiveUI](https://www.naiveui.com/)：一个 Vue 3 组件库，比较完整，主题可调，使用 TypeScript，快，有点意思
- [Tailwind CSS](https://tailwindcss.com/)：一个功能类优先的 CSS 框架
- [VueUse](https://vueuse.org/)：Vue 开发常用工具集
- [ArtPlayer](https://artplayer.org/)：一个现代化的 HTML5 视频播放器

## 开发与构建

此项目使用 [pnpm](https://pnpm.io/zh/) 进行依赖管理，请确保你已经全局安装了 pnpm.

### 安装依赖

```sh
pnpm i
```

### 启动开发服务器

```sh
pnpm dev
```

### 构建

```sh
pnpm generate
```

### 本地预览

```sh
pnpm preview
```

## License Scan

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMagmaBlock%2FLavaAnimeLibWeb.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMagmaBlock%2FLavaAnimeLibWeb?ref=badge_large)
