## 关于熔岩番剧库 LavaAnimeLib

这是个人创建的一个**私有**番剧库，目标是自建一个高画质高质量的私有番剧动画小圈子～

本项目创立于 2021 年 4 月，至今不计划对外部开放和盈利。

### 介绍

本质是一个将番剧下载自动化可视化的平台。通过脚本实现下载 RSS，通过 Web、第三方播放器和前后端程序提供播放。方便自己和好友追番。同时希望在未来尝试融合弹弹 Play 和 Bangumi 的记录功能增强体验。

本项目使用到了大量来自开源或其他开放社区的软件和数据，在此表示感谢：

- 番剧资料信息
  - [Bangumi 番组计划](https://bgm.tv/)
- LavaAnimeWeb V2 新前端技术实现 _完全重写_
  - [Nuxt.js](https://nuxt.com/) 一个直观而强大的 Vue 全栈框架
  - [Vue 3](https://cn.vuejs.org/) 渐进式 JavaScript 前端框架
  - [tailwindcss](https://tailwindcss.com/) 使用 className 快速开发 CSS 的工具样式库
  - [Naive UI](https://www.naiveui.com/zh-CN/os-theme) 有点意思 十分年轻的 Vue 3 前端样式组件库
  - [Artplayer](https://artplayer.org/document/zh-cn/) 一款现代多功能的 HTML 5 视频播放器
- LavaAnimeLib V2 新后端技术实现 _完全重写_
  - [Express 4](http://expressjs.com/) 基于 NodeJS 的 Web 应用开发框架
  - [NodeJS](https://nodejs.org/en/) 在服务端上运行的 JavaScript
  - [AList](https://alist-doc.nn.ci/) 支持大量云存储管理的列表程序，支持 Web、WebDAV 和 HTTP API 对接。
- 同时感谢各大字幕组和压制搬运组！

### 其他

21 年 4 月创立之初实际上我并不会任何一门开发语言，甚至 HTML 都不会。因此这个项目是我一边学一边做做出来的。至今前端后端以及资源的查找维护都是我一个人在做。

直至 22 年 1 月，基于 Cloudreve 的 API 用 JQuery 写出了第一个界面，LavaAnimeLibWeb V1 自此诞生。

22 年 6 月 8 日，[前端的第二个大版本](https://github.com/MagmaBlock/LavaAnimeLibWeb/commit/11a27d95a3741b76b1fd08bd39857c17ffe675ae)立项，基于 Vite Vue 进行全面重写，2022 年 8 月 22 日，V2 前端 Beta 公开测试。
