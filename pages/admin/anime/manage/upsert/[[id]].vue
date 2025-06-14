<template>
  <NSpace vertical>
    <NCard :title="isEditMode ? '编辑番剧' : '创建新番剧'">
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <NFormItem v-if="isEditMode" label="ID" path="id">
          <NInputNumber v-model:value="formModel.id" disabled />
        </NFormItem>
        <NFormItem label="显示名称" path="name">
          <NInput
            v-model:value="formModel.name"
            placeholder="请输入动画名称"
            clearable
          />
        </NFormItem>
        <NFormItem label="作品原名" path="originalName">
          <NInput
            v-model:value="formModel.originalName"
            placeholder="请输入原名（可选）"
            clearable
          />
        </NFormItem>
        <NFormItem label="简介" path="summary">
          <NInput
            v-model:value="formModel.summary"
            type="textarea"
            placeholder="请输入简介（可选）"
            clearable
          />
        </NFormItem>
        <NFormItem label="BDRip" path="bdrip">
          <NSwitch v-model:value="formModel.bdrip" />
        </NFormItem>
        <NFormItem label="NSFW" path="nsfw">
          <NSwitch v-model:value="formModel.nsfw" />
        </NFormItem>
        <NFormItem label="放映平台" path="platform">
          <NSelect
            v-model:value="formModel.platform"
            :options="platformOptions"
            clearable
          />
        </NFormItem>
        <NFormItem label="开播时间" path="date">
          <NDatePicker
            :value="formModel.date?.getTime()"
            @update:value="
              (newDate) => (formModel.date = newDate ? new Date(newDate) : null)
            "
            type="datetime"
            clearable
          />
        </NFormItem>
        <NFormItem label="所属年份" path="releaseYear">
          <NInputNumber v-model:value="formModel.releaseYear" clearable />
        </NFormItem>
        <NFormItem label="所属季度" path="releaseSeason">
          <NSelect
            v-model:value="formModel.releaseSeason"
            :options="seasonOptions"
            clearable
          />
        </NFormItem>
        <NFormItem label="来源地区" path="region">
          <NSelect
            v-model:value="formModel.region"
            :options="regionOptions"
            clearable
          />
        </NFormItem>
      </NForm>
      <NSpace justify="end">
        <NButton type="primary" @click="handleSubmit">{{
          isEditMode ? "更新" : "创建"
        }}</NButton>
      </NSpace>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useMessage } from "naive-ui";
import type { FormInst, FormRules } from "naive-ui";
import type { Anime } from "@prisma/client";
import { z } from "zod";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();
const router = useRouter();
const route = useRoute();

const formRef = ref<FormInst | null>(null);
const formModel = ref<Partial<Anime>>({});

const isEditMode = computed(() => !!route.params.id);

const rules: FormRules = {
  name: {
    required: true,
    message: "请输入动画名称",
    trigger: "blur",
  },
};

const platformOptions = [
  { label: "TV", value: "TV" },
  { label: "Web", value: "Web" },
  { label: "OVA", value: "OVA" },
  { label: "Movie", value: "Movie" },
  { label: "Other", value: "Other" },
];

const seasonOptions = [
  { label: "4月春", value: "4月春" },
  { label: "7月夏", value: "7月夏" },
  { label: "10月秋", value: "10月秋" },
  { label: "1月冬", value: "1月冬" },
];

const regionOptions = [
  { label: "日本", value: "Japan" },
  { label: "中国", value: "China" },
  { label: "韩国", value: "Korea" },
  { label: "欧洲", value: "Europe" },
  { label: "美国", value: "America" },
  { label: "其他", value: "Other" },
];

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const animeId = Number(route.params.id);
      const animeData = await $client.pages.admin.anime.manage.getAnime.query({
        id: animeId,
      });
      formModel.value = animeData;
    } catch (error) {
      message.error("获取动画数据失败：" + (error as Error).message);
    }
  }
});

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        const result =
          await $client.pages.admin.anime.manage.upsertAnime.mutate(
            z
              .object({
                id: z.number().optional(),
                name: z.string(),
                originalName: z.string().optional(),
                summary: z.string().optional(),
                bdrip: z.boolean().default(false),
                nsfw: z.boolean().default(false),
                platform: z
                  .enum(["TV", "Web", "OVA", "Movie", "Other"])
                  .optional(),
                date: z.date().optional(),
                releaseYear: z.number().int().optional(),
                releaseSeason: z.string().optional(),
                region: z
                  .enum([
                    "Japan",
                    "China",
                    "Korea",
                    "Europe",
                    "America",
                    "Other",
                  ])
                  .optional(),
              })
              .parse(formModel.value),
          );
        message.success(
          isEditMode.value
            ? `更新成功，Anime ID: ${result.id}`
            : `创建成功，新 Anime 的 ID 是 ${result.id}`,
        );
        router.replace("/admin/anime/manage");
      } catch (error) {
        message.error(
          (isEditMode.value ? "更新" : "创建") +
            "失败：" +
            (error as Error).message,
        );
      }
    } else {
      console.log(errors);
      message.error("验证失败，请检查表单");
    }
  });
};
</script>

<style></style>
