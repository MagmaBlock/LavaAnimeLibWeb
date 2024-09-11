<template>
  <NCard title="编辑存储器">
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
          disabled
          placeholder="存储器 ID，不可修改"
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
        <NButton type="primary" attr-type="submit">更新存储器</NButton>
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
const route = useRoute();

const formModel = ref({
  id: "",
  name: "",
  description: "" as string | null,
  type: null as StorageType | null,
  config: "" as string | null,
  noNSFW: false,
  noDownload: false,
  bindScraper: null as StorageScraper | null,
});

const rules = {
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
  ([label, value]) => ({ label, value })
);
const scraperOptions = Object.entries(StorageScraper).map(([label, value]) => ({
  label,
  value,
}));

onMounted(async () => {
  const id = route.params.id as string;
  try {
    const storage = await $client.pages.admin.storage.manager.getStorage.query({
      id,
    });
    if (storage) {
      formModel.value = { ...storage };
    } else {
      message.error("未找到指定的存储器");
      router.push("/admin/storage/manage");
    }
  } catch (error) {
    message.error(`加载存储器信息失败: ${(error as Error).message}`);
    router.push("/admin/storage/manage");
  }
});

const handleSubmit = async () => {
  try {
    const result =
      await $client.pages.admin.storage.manager.updateStorage.mutate(
        z
          .object({
            id: z.string().min(1),
            name: z.string().optional(),
            description: z.string().optional().nullable(),
            type: z.nativeEnum(StorageType).optional(),
            config: z.string().optional().nullable(),
            noNSFW: z.boolean().optional(),
            noDownload: z.boolean().optional(),
            bindScraper: z.nativeEnum(StorageScraper).optional().nullable(),
          })
          .parse(formModel.value)
      );
    if (result.id) {
      message.success("存储器更新成功");
      router.replace("/admin/storage/manage");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      message.error(
        `输入验证失败: ${error.errors.map((e) => e.message).join(", ")}`
      );
    } else {
      message.error(`更新失败: ${(error as Error).message}`);
    }
  }
};
</script>
