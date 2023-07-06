import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import UAParser from "ua-parser-js";
import VueLazyLoad from "vue3-lazyload";

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

export const app = createApp(App).use(pinia).use(router).use(VueLazyLoad);
app.mount("#app");
