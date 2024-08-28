<template>
  <div>
    <NFlex class="mb-4" :size="[64, 8]">
      <div>
        <NH3>当前头像</NH3>
        <NAvatar
          class="ring-1 ring-gray-200 dark:ring-zinc-700"
          fallback-src="/Transparent_Akkarin.jpg"
          :size="128"
          :src="currentAvatarUrl"
        />
      </div>
      <div>
        <NH3>新头像</NH3>
        <NFlex>
          <NAvatar
            class="ring-1 ring-gray-200 dark:ring-zinc-700"
            fallback-src="/Transparent_Akkarin.jpg"
            :size="128"
            :src="previewAvatarUrl"
          />
          <NAvatar
            class="ring-1 ring-gray-200 dark:ring-zinc-700"
            fallback-src="/Transparent_Akkarin.jpg"
            round
            :size="128"
            :src="previewAvatarUrl"
          />
        </NFlex>
      </div>
    </NFlex>

    <NButton strong secondary @click="saveAvatar" :loading="isSaving">
      保存
    </NButton>

    <NDivider />

    <NH3>头像图片链接</NH3>
    <NInput
      v-model:value="newAvatarURL"
      type="url"
      :input-props="{ autocomplete: 'off' }"
      placeholder="自定义的图片地址, 需要 HTTPS"
      clearable
    />
    <NH3>快速使用第三方头像</NH3>
    <NTabs type="line" animated class="m-0">
      <NTabPane name="qq" tab="使用 QQ 头像">
        <NInput
          v-model:value="qqNumber"
          type="text"
          placeholder="QQ 号"
          clearable
        />
      </NTabPane>
      <NTabPane name="gravatar" tab="使用 Gravatar 头像">
        <NSpace vertical>
          <NInput
            v-model:value="gravatarEmail"
            type="email"
            placeholder="Gravatar 邮箱"
            clearable
          />
          <NSelect
            v-model:value="gravatarHost"
            :options="gravatarHostOptions"
          />
        </NSpace>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup>
import gravatar from "gravatar";
import { useMessage } from "naive-ui";

definePageMeta({
  layout: "user-info",
});

useHead({ title: "修改头像" });

const newAvatarURL = ref("");
const qqNumber = ref("");
const gravatarEmail = ref("");
const gravatarHost = ref("https://gravatar.loli.net");
const gravatarHostOptions = ref([
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
]);

const message = useMessage();
const { $client } = useNuxtApp();

const currentAvatarUrl = ref("");
const isSaving = ref(false);

onMounted(async () => {
  try {
    const result = await $client.pages.userInfo.getAvatar.query();
    currentAvatarUrl.value = result.avatarUrl || "/Transparent_Akkarin.jpg";
  } catch (error) {
    message.error("获取当前头像失败");
  }
});

watch(qqNumber, (value) => {
  newAvatarURL.value = `https://q.qlogo.cn/g?b=qq&nk=${value}&s=640`;
});

watch(gravatarEmail, () => {
  newAvatarURL.value = generateGravatarUrl();
});

watch(gravatarHost, () => {
  newAvatarURL.value = generateGravatarUrl();
});

async function saveAvatar() {
  if (!newAvatarURL.value) {
    message.warning("请先选择或输入新的头像链接");
    return;
  }

  isSaving.value = true;
  try {
    const result = await $client.pages.userInfo.avatar.mutate({
      url: newAvatarURL.value,
    });
    message.success(result.message);
    currentAvatarUrl.value = result.data.avatarUrl;
    newAvatarURL.value = "";
  } catch (error) {
    message.error("保存头像时发生错误");
  } finally {
    isSaving.value = false;
  }
}

function generateGravatarUrl() {
  let url = gravatar.url(gravatarEmail.value, {
    s: "400",
    protocol: "https",
  });
  let urlPath = new URL(url).pathname + new URL(url).search;
  if (gravatarHost.value == "default") {
    return url;
  } else {
    return gravatarHost.value + urlPath;
  }
}

const previewAvatarUrl = computed(() => {
  return newAvatarURL.value || currentAvatarUrl.value;
});
</script>
