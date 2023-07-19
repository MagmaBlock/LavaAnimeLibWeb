import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import UAParser from "ua-parser-js";
import VueLazyLoad from "vue3-lazyload";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import updateLocale from "dayjs/plugin/updateLocale";

import App from "./App.vue";
import router from "./router"; // src/router/index.js
import "animate.css";
import "./index.css"; // tailwind directives
import "./transition.css"; // 自定义的切换动画
// 根据系统和浏览器决定是否优化滚动条
if (
  UAParser().engine.name == "Blink" &&
  ["Windows", "Mac OS"].includes(UAParser().os.name)
) {
  import("./scrollbar.css");
}

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 在 Tailwind 后插入 NaiveUI 的 css
const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

// dayjs 处理
dayjs.locale("zh-cn");
dayjs.extend(updateLocale);
dayjs.updateLocale("zh-cn", {
  calendar: {
    lastDay: "[昨天] HH:mm",
    sameDay: "[今天] HH:mm",
    nextDay: "[明天] HH:mm",
    lastWeek: "[上周]dd HH:mm",
    nextWeek: "[下周]dd HH:mm",
    sameElse: "YYYY-MM-DD HH:mm",
  },
});

export const app = createApp(App).use(pinia).use(router).use(VueLazyLoad);
app.mount("#app");
