<template>
  <NSpace vertical>
    <!-- 存储节点选择 -->
    <NCard title="存储节点选择">
      <NSelect
        v-model:value="selectedStorage"
        :options="storageOptions"
        placeholder="选择存储节点"
        @update:value="handleStorageChange"
      />
    </NCard>

    <!-- 文件索引列表 -->
    <NCard title="文件索引列表" v-if="selectedStorage">
      <NSpace vertical>
        <NSpace>
          <NButton @click="navigateToParent" :disabled="currentPath === '/'">
            返回上级
          </NButton>
          <NButton @click="refreshCurrentDirectory" :loading="isLoading">
            刷新
          </NButton>
          <NButton
            @click="scanSelectedPaths"
            type="primary"
            :loading="isLoading"
            :disabled="selectedRows.length === 0"
          >
            扫描选中路径
          </NButton>
          <NButton @click="scanAllPaths" type="info" :loading="isLoading">
            扫描全盘
          </NButton>
        </NSpace>
        <NDataTable
          :columns="columns"
          :data="fileList"
          :row-key="(row) => row.id"
          @update:checked-row-keys="handleCheckedRowKeysChange"
          :checked-row-keys="selectedRows.map((row) => row.id)"
        />
      </NSpace>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import { ref, computed, h, onMounted } from "vue";
import {
  NSpace,
  NCard,
  NSelect,
  NButton,
  NDataTable,
  NIcon,
  useMessage,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import type { Storage, StorageIndex } from "@prisma/client";
import { Icon } from "#components";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();

const storageList = ref<Storage[]>([]);
const selectedStorage = ref<string | null>(null);
const fileList = ref<StorageIndex[]>([]);
const selectedRows = ref<StorageIndex[]>([]);
const isLoading = ref(false);
const currentPath = ref("/");

// 获取存储节点列表
const fetchStorageList = async () => {
  storageList.value =
    await $client.pages.admin.storage.fileIndex.getStorageList.query();
  if (storageList.value.length > 0) {
    selectedStorage.value = storageList.value[0].id;
    await handleStorageChange(selectedStorage.value);
  }
};

// 存储节点选项
const storageOptions = computed(() =>
  storageList.value.map((storage) => ({
    label: `[${storage.type}] ${storage.name} (${storage.id})${
      storage.description ? " - " + storage.description : ""
    }`,
    value: storage.id,
  }))
);

// 获取文件索引列表
const getDirectoryContents = async (path = "/") => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  isLoading.value = true;
  try {
    fileList.value =
      await $client.pages.admin.storage.fileIndex.getDirectoryContents.query({
        storageId: selectedStorage.value,
        path,
      });
    currentPath.value = path;
  } catch (error) {
    message.error(`获取文件索引失败: ${(error as Error).message}`);
  } finally {
    isLoading.value = false;
  }
};

// 处理存储节点变化
const handleStorageChange = async (value: string | null) => {
  selectedStorage.value = value;
  if (value) {
    await getDirectoryContents();
  } else {
    fileList.value = [];
    currentPath.value = "/";
  }
};

// 扫描选中路径
const scanSelectedPaths = async () => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  const paths = selectedRows.value.map((file) => file.path + "/" + file.name);
  await scanPaths(paths);
};

// 扫描全盘
const scanAllPaths = async () => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  await scanPaths(["/"]);
};

// 扫描路径
const scanPaths = async (paths: string[]) => {
  isLoading.value = true;
  for (const path of paths) {
    try {
      const result = await $client.pages.admin.storage.fileIndex.scan.mutate({
        storageId: selectedStorage.value!,
        path,
      });
      message.success(
        `${selectedStorage.value} 的 ${path} 扫描完成，获取到 ${result.scannedCount} 个文件`
      );
    } catch (error) {
      message.error(`扫描失败: ${(error as Error).message}`);
    }
  }
  await refreshCurrentDirectory();
  isLoading.value = false;
};

// 处理选中变化
const handleCheckedRowKeysChange = (keys: (string | number)[]) => {
  selectedRows.value = fileList.value.filter(
    (file) => keys.includes(file.id) && file.isDirectory
  );
};

// 刷新当前目录
const refreshCurrentDirectory = async () => {
  await getDirectoryContents(currentPath.value);
};

// 导航到父目录
const navigateToParent = () => {
  if (currentPath.value !== "/") {
    const parentPath =
      currentPath.value.split("/").slice(0, -1).join("/") || "/";
    getDirectoryContents(parentPath);
  }
};

// 处理文件夹点击
const handleFolderClick = (path: string) => {
  getDirectoryContents(path);
};

// 定义表格列
const columns: DataTableColumns<StorageIndex> = [
  {
    type: "selection",
    disabled: (row) => !row.isDirectory,
  },
  {
    title: "名称",
    key: "name",
    render: (row) => {
      return h(
        "span",
        {
          onClick: () => {
            if (row.isDirectory) {
              handleFolderClick(row.path + "/" + row.name);
            }
          },
          style: {
            cursor: row.isDirectory ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
          },
        },
        [
          h(
            NIcon,
            { style: { marginRight: "8px" } },
            {
              default: () =>
                h(Icon, {
                  name: row.isDirectory
                    ? "material-symbols:folder"
                    : "material-symbols:description",
                }),
            }
          ),
          row.name,
        ]
      );
    },
    sorter: "default",
  },
  { title: "类型", key: "type", sorter: "default" },
  { title: "大小", key: "size", sorter: "default" },
  { title: "路径", key: "path", sorter: "default" },
];

// 初始化
onMounted(() => {
  fetchStorageList();
});
</script>
