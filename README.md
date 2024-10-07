# LavaAnimeLib

熔岩番剧库 LavaAnimeLib，当前版本 V3，仍在开发中。

本应用是一个适合个人托管的家庭局域网番剧影视库软件。本应用不提供任何番剧视频资源，也不提供在线资源检索服务，仅对硬盘或 Alist 等第三方存储器中的番剧进行管理和检索。

您可以使用本应用将番剧资料和您的视频结合，并获得更好的观看体验。

本项目是一个使用 Nuxt 开发的全栈应用程序，前端使用 NaiveUI 和 TailwindCSS，后端使用 TRPC、Prisma 和原生 TypeScript 实现。

## 前端技术实现

本项目的（前端）主要使用了以下库：

- [Nuxt](https://nuxt.com/)：一个开箱即用的 Vue 开发环境，提供 SSR、自动导入、跨平台部署、TypeScript 等支持，其还包含了以下框架：
- [Pinia](https://pinia.vuejs.org/zh/)：符合直觉的 Vue.js 状态管理库
- [NaiveUI](https://www.naiveui.com/)：一个 Vue 3 组件库，比较完整，主题可调，使用 TypeScript，快，有点意思
- [Tailwind CSS](https://tailwindcss.com/)：一个功能类优先的 CSS 框架
- [VueUse](https://vueuse.org/)：Vue 开发常用工具集
- [ArtPlayer](https://artplayer.org/)：一个现代化的 HTML5 视频播放器

## 后端架构设计

本应用的所有数据使用 Prisma ORM 存储在 MySQL 上，支持 5.7-8 版本。

本应用目前仅实现了 Alist 作为存储器，因此，您必须再额外部署一个可以被前端访问的 Alist 服务。

本应用的服务端位于 `server/` 目录下。Nuxt 框架实现了 Web 服务器，访问 Web 服务器时，Nuxt 会为您提供前端静态文件资源。在 Web 服务器的 `/api` 路径下，是前端访问后端的 API 节点。我们目前使用 TRPC 框架实现 API 接口，具体的路由请见 `server/trpc/`。

在 `server/services/` 目录中，包含了本应用的业务服务层实现，这个文件夹中的代码多为面向对象的类和接口，且被设计为与 Nuxt 无关，如有需要，能够轻松在未来被移植到其他环境中。

TRPC 的 API 接口层主要负责实现前端和 service 层的沟通，因此在 TRPC 中的代码逻辑多是耦合、难以复用的。如果未来要为本应用实现 Web 端以外的客户端，则可能需要视客户端情况再添加一套类似 HTTP 协议的接口层。

## 开发与构建

此项目使用 [pnpm](https://pnpm.io/zh/) 进行依赖管理，请确保你已经全局安装了 pnpm。

### 配置 `.env` 文件

```
DATABASE_URL="mysql://user:password@localhost:3306/lavaanimelib"
AUTH_SECRET="your-secret-key" # 请更换为随机字符串，这是 JWT 的密钥
```

### 安装依赖

```sh
pnpm install
```

### 启动开发服务器

```sh
pnpm dev
```
