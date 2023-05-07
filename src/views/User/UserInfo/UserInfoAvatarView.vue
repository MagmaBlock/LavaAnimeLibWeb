<template>
  <div>
    <n-h2>头像预览</n-h2>
    <n-space class="mb-4">
      <n-avatar
        class="ring-1 ring-gray-200 dark:ring-zinc-700"
        fallback-src="/Transparent_Akkarin.jpg"
        :size="128"
        :src="avatarUrl"
      />
      <n-avatar
        class="ring-1 ring-gray-200 dark:ring-zinc-700"
        fallback-src="/Transparent_Akkarin.jpg"
        round
        :size="108"
        :src="avatarUrl"
      />
      <n-avatar
        class="ring-1 ring-gray-200 dark:ring-zinc-700"
        fallback-src="/Transparent_Akkarin.jpg"
        round
        :size="72"
        :src="avatarUrl"
      />
      <n-button strong secondary @click="saveAvatar"> 保存 </n-button>
    </n-space>
    <n-h3>头像图片链接</n-h3>
    <n-input
      v-model:value="newAvatarURL"
      type="url"
      :input-props="{ autocomplete: 'off' }"
      placeholder="自定义的图片地址, 需要 HTTPS"
      clearable
    />
    <n-h3>快速使用第三方头像</n-h3>
    <n-tabs type="line" animated class="m-0">
      <n-tab-pane name="qq" tab="使用 QQ 头像">
        <n-input
          v-model:value="qqNumber"
          type="text"
          placeholder="QQ 号"
          clearable
        />
      </n-tab-pane>
      <n-tab-pane name="gravatar" tab="使用 Gravatar 头像">
        <n-space vertical>
          <n-input
            v-model:value="gravatarEmail"
            type="email"
            placeholder="Gravatar 邮箱"
            clearable
          />
          <n-select
            v-model:value="gravatarHost"
            :options="gravatarHostOptions"
          />
        </n-space>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script>
import gravatar from "gravatar";
import { LavaAnimeAPI } from "../../../common/api.js";
import { getUserInfo, userInfo } from "../../../common/API/user.js";

export default {
  data() {
    return {
      type: "url",
      newAvatarURL: "",
      qqNumber: "",
      gravatarEmail: "",
      gravatarHost: "https://gravatar.loli.net",
      gravatarHostOptions: [
        {
          label: "sm.ms 镜像 (loli.net)",
          value: "https://gravatar.loli.net",
        },
        {
          label: "极客族镜像",
          value: "https://sdn.geekzu.org",
        },
        {
          label: "Cravatar 镜像",
          value: "https://cravatar.cn",
        },
        {
          label: "webp.se 镜像",
          value: "https://gravatar.webp.se",
        },
        {
          label: "WordPress 官方 (大陆被墙)",
          value: "default",
        },
      ],
    };
  },
  setup() {
    getUserInfo();
    return { userInfo };
  },
  watch: {
    qqNumber(value) {
      this.newAvatarURL = `https://q.qlogo.cn/g?b=qq&nk=${value}&s=640`;
    },
    gravatarEmail() {
      this.newAvatarURL = this.generateGravatarUrl();
    },
    gravatarHost() {
      this.newAvatarURL = this.generateGravatarUrl();
    },
  },
  methods: {
    async saveAvatar() {
      try {
        let result = await LavaAnimeAPI.post("/v2/user/info/avatar", {
          url: this.newAvatarURL,
        });
        if (result.data.code == 200) {
          $message.success(result.data.message);
        }
      } catch (error) {}
    },
    generateGravatarUrl() {
      let url = gravatar.url(this.gravatarEmail, {
        s: "400",
        protocol: "https",
      });
      let urlPath = new URL(url).pathname + new URL(url).search;
      if (this.gravatarHost == "default") {
        return url;
      } else {
        return this.gravatarHost + urlPath;
      }
    },
  },
  computed: {
    avatarUrl() {
      return (
        this.newAvatarURL ||
        this.userInfo.data?.avatar?.url ||
        "/Transparent_Akkarin.jpg"
      );
    },
  },
};
</script>
