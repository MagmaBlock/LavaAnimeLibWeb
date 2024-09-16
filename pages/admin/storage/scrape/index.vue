<template>
  <NFlex vertical>
    <NFlex align="center">
      <NTag :bordered="false">当前选中存储：</NTag>
      <NBreadcrumb>
        <NBreadcrumbItem>
          {{ selectedStorage || "未选择" }}
        </NBreadcrumbItem>
      </NBreadcrumb>
    </NFlex>
    <NScrollbar x-scrollable>
      <NFlex align="center">
        <NTag :bordered="false">当前选中路径：</NTag>
        <NBreadcrumb v-if="selectedPath">
          <NBreadcrumbItem>根目录</NBreadcrumbItem>
          <NBreadcrumbItem
            v-for="(segment, index) in pathSegments"
            :key="index"
          >
            {{ segment }}
          </NBreadcrumbItem>
        </NBreadcrumb>
        <NText v-else>未选择</NText>
      </NFlex>
    </NScrollbar>

    <NFlex>
      <NButton @click="showModal = true">选择路径</NButton>
      <NModal
        v-model:show="showModal"
        preset="card"
        title="选择路径"
        style="width: 600px"
      >
        <AdminStoragePathSelector
          mode="selectPath"
          folder-only
          v-model:selectedPath="selectedPath"
          v-model:selectedStorage="selectedStorage"
          @update:selectedPath="handleCurrentPathChange"
        />
      </NModal>
      <NButton
        @click="scrapeCurrentPath"
        type="primary"
        :loading="isLoading"
        :disabled="!selectedPath"
      >
        挂削当前路径
      </NButton>
      <NButton
        @click="applyScraperResult"
        type="info"
        :disabled="!scrapeResult"
        :loading="isApplying"
      >
        应用挂削结果
      </NButton>
    </NFlex>

    <NCard title="挂削结果" v-if="scrapeResult">
      <NScrollbar class="max-h-96">
        <NCode :code="JSON.stringify(scrapeResult, null, 2)" />
      </NScrollbar>
    </NCard>
  </NFlex>
</template>

<script lang="ts" setup>
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NModal,
  NScrollbar,
  NText,
  useMessage,
} from "naive-ui";
import { computed, ref } from "vue";
import type { StorageScrapeResult } from "~/server/services/storage/scraper/types/result";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();

const isLoading = ref(false);
const isApplying = ref(false);
const scrapeResult = ref<StorageScrapeResult[] | null>(null);
const selectedPath = ref<string | null>(null);
const selectedStorage = ref<string | null>(null);
const showModal = ref(false);

const pathSegments = computed(() => {
  return selectedPath.value
    ? selectedPath.value.split("/").filter(Boolean)
    : [];
});

const handleCurrentPathChange = (path: string) => {
  selectedPath.value = path;
  showModal.value = false;
};

const scrapeCurrentPath = async () => {
  if (!selectedStorage.value || !selectedPath.value) return;

  isLoading.value = true;
  try {
    const result =
      await $client.pages.admin.storage.scrape.scrapeChildFiles.query({
        storageId: selectedStorage.value,
        path: selectedPath.value,
      });
    scrapeResult.value = result.results;
    message.success("挂削完成");
  } catch (error) {
    message.error(`挂削失败: ${(error as Error).message}`);
  } finally {
    isLoading.value = false;
  }
};

const applyScraperResult = async () => {
  if (!scrapeResult.value) return;

  isApplying.value = true;
  try {
    await $client.pages.admin.storage.scrape.applyStorageScraperResult.mutate({
      results: scrapeResult.value,
    });
    message.success("挂削结果应用成功");
    scrapeResult.value = null;
  } catch (error) {
    message.error(`应用挂削结果失败: ${(error as Error).message}`);
  } finally {
    isApplying.value = false;
  }
};
</script>
