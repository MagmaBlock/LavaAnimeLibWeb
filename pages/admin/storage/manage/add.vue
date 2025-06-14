<template>
  <NCard title="新建存储器">
    <NForm
      :model="formModel"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      @submit.prevent="handleSubmit"
    >
      <NFormItem label="ID" path="id">
        <NInput
          v-model:value="formModel.id"
          placeholder="存储器 ID，建议不含中文，作为程序内部的唯一标识"
        />
      </NFormItem>
      <NFormItem label="名称" path="name">
        <NInput v-model:value="formModel.name" />
      </NFormItem>
      <NFormItem label="描述" path="description">
        <NInput v-model:value="formModel.description" type="textarea" />
      </NFormItem>
      <NFormItem label="类型" path="type">
        <NSelect v-model:value="formModel.type" :options="storageTypeOptions" />
      </NFormItem>
      <NFormItem label="配置" path="config">
        <NInput
          v-model:value="formModel.config"
          type="textarea"
          placeholder="请输入存储器配置（JSON格式）"
        />
      </NFormItem>
      <NFormItem label="禁止 NSFW" path="noNSFW">
        <NSwitch v-model:value="formModel.noNSFW" />
      </NFormItem>
      <NFormItem label="禁止下载" path="noDownload">
        <NSwitch v-model:value="formModel.noDownload" />
      </NFormItem>
      <NFormItem label="绑定挂削器" path="bindScraper">
        <NSelect
          v-model:value="formModel.bindScraper"
          :options="scraperOptions"
        />
      </NFormItem>
      <NFormItem>
        <NButton type="primary" attr-type="submit">创建存储器</NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<script lang="ts" setup>
import { StorageType, StorageScraper } from "@prisma/client";
import { z } from "zod";

definePageMeta({
  layout: "admin",
});

const message = useMessage();
const { $client } = useNuxtApp();
const router = useRouter();

const formModel = ref({
  id: "",
  name: "",
  description: "",
  type: null as StorageType | null,
  config: "",
  noNSFW: false,
  noDownload: false,
  bindScraper: null as StorageScraper | null,
});

const rules = {
  id: {
    required: true,
    message: "请输入存储器ID",
    trigger: "blur",
  },
  name: {
    required: true,
    message: "请输入存储器名称",
    trigger: "blur",
  },
  type: {
    required: true,
    message: "请选择存储器类型",
    trigger: "change",
  },
};

const storageTypeOptions = Object.entries(StorageType).map(
  ([label, value]) => ({ label, value }),
);
const scraperOptions = Object.entries(StorageScraper).map(([label, value]) => ({
  label,
  value,
}));

const handleSubmit = async () => {
  try {
    const result =
      await $client.pages.admin.storage.manager.createStorage.mutate(
        z
          .object({
            id: z.string().min(1),
            name: z.string(),
            description: z.string().optional().nullable(),
            type: z.nativeEnum(StorageType),
            config: z.string().optional().nullable(),
            noNSFW: z.boolean().default(false),
            noDownload: z.boolean().default(false),
            bindScraper: z.nativeEnum(StorageScraper).optional().nullable(),
          })
          .parse(formModel.value),
      );
    if (result.id) {
      message.success("存储器创建成功");
      router.replace("/admin/storage/manage");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      message.error(
        `输入验证失败: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    } else {
      message.error(`创建失败: ${(error as Error).message}`);
    }
  }
};
</script>
