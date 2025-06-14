import { defineStore } from "pinia";
import { createDiscreteApi } from "naive-ui";

/**
 * Naive UI 消息和通知 API Store
 * 用于在非组件环境下使用 message 和 notification
 */
export const useNaiveUiApiStore = defineStore("naiveUiApiStore", () => {
  // 创建离散 API 实例
  const { message, notification } = createDiscreteApi([
    "message",
    "notification",
  ]);

  return {
    message,
    notification,
  };
});
