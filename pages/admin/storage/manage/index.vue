<template>
  <NSpace vertical>
    <NCard title="存储器列表">
      <NSpace vertical>
        <NButton
          @click="router.push('/admin/storage/manage/add')"
          type="primary"
        >
          创建新存储器
        </NButton>
        <NDataTable
          :columns="columns"
          :data="storageList"
          :row-key="(row) => row.id"
        />
      </NSpace>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import { ref, h } from "vue";
import {
  NSpace,
  NCard,
  NButton,
  NDataTable,
  useMessage,
  NPopconfirm,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import type { Storage } from "@prisma/client";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();
const router = useRouter();

const storageList = ref<Storage[]>([]);

const fetchStorageList = async () => {
  storageList.value =
    await $client.pages.admin.storage.manager.getAllStorage.query();
};

const handleDelete = async (id: string) => {
  try {
    await $client.pages.admin.storage.manager.deleteStorage.mutate({ id });
    message.success("删除成功");
    fetchStorageList();
  } catch (error) {
    message.error(`删除失败: ${(error as Error).message}`);
  }
};

const columns: DataTableColumns<Storage> = [
  { title: "ID", key: "id" },
  { title: "名称", key: "name" },
  { title: "类型", key: "type" },
  {
    title: "禁止NSFW",
    key: "noNSFW",
    render: (row) => (row.noNSFW ? "是" : "否"),
  },
  {
    title: "禁止下载",
    key: "noDownload",
    render: (row) => (row.noDownload ? "是" : "否"),
  },
  { title: "绑定挂削器", key: "bindScraper" },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              onClick: () => {
                router.push(`/admin/storage/manage/update/${row.id}`);
              },
            },
            { default: () => "编辑" }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDelete(row.id),
              negativeText: "取消",
              positiveText: "确定",
            },
            {
              trigger: () => h(NButton, {}, { default: () => "删除" }),
              default: () => "确定要删除这个存储器吗？",
            }
          ),
        ],
      });
    },
  },
];

fetchStorageList();
</script>
