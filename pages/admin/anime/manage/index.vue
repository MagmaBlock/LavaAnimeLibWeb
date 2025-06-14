<template>
  <NSpace vertical>
    <NCard title="番剧列表">
      <NSpace vertical>
        <NuxtLink to="/admin/anime/manage/upsert">
          <NButton type="primary">手动创建</NButton>
        </NuxtLink>
        <NDataTable
          :loading="animeListStatus === 'pending'"
          :columns="columns"
          :data="animeList ?? []"
          :row-key="(row) => row.id"
          :pagination="{
            pageSize: 8,
          }"
        />
      </NSpace>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import type { Anime } from "@prisma/client";
import type { DataTableColumns } from "naive-ui";
import { NButton, NCard, NDataTable, NSpace } from "naive-ui";
import { h } from "vue";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const router = useRouter();

const {
  data: animeList,
  status: animeListStatus,
  execute: animeListExecute,
} = $client.pages.admin.anime.manage.getAnimeList.useLazyQuery();

const columns: DataTableColumns<Anime> = [
  { title: "ID", key: "id" },
  { title: "名称", key: "name" },
  { title: "原名", key: "originalName" },
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
                router.push(`/admin/anime/manage/upsert/${row.id}`);
              },
              size: "small",
              secondary: true,
            },
            { default: () => "编辑" },
          ),
        ],
      });
    },
  },
];
</script>

<style></style>
