<template>
  <NSpace vertical>
    <!-- 文件索引说明 -->
    <NAlert title="什么是文件索引？" type="info" closable>
      <div>
        文件索引是番剧库为提高性能和兼容性而创建的文件列表缓存。读取真实存储节点后，会建立相应的索引。<br />
        加速访问：通过索引快速获取文件信息，提高性能。<br />
        抹平差异：统一处理不同存储节点的文件。<br />
        优化资源：减少对实际文件系统的访问，降低系统负担。
      </div>
    </NAlert>

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
          <NButton
            @click="indexSelectedPaths"
            type="primary"
            :loading="isIndexing"
            :disabled="selectedRows.length === 0"
          >
            索引选中目录
          </NButton>
          <NButton
            @click="indexEntireStorage"
            type="info"
            :loading="isIndexing"
          >
            索引整个存储
          </NButton>
        </NSpace>
        <NBreadcrumb>
          <NBreadcrumbItem @click="navigateToRoot">根目录</NBreadcrumbItem>
          <NBreadcrumbItem
            v-for="(segment, index) in pathSegments"
            :key="index"
            @click="navigateToPath(index)"
          >
            {{ segment }}
          </NBreadcrumbItem>
        </NBreadcrumb>

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
import { Icon } from "#components";
import type { Storage, StorageIndex } from "@prisma/client";
import type { DataTableColumns } from "naive-ui";
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NDataTable,
  NIcon,
  NSelect,
  NSpace,
  useMessage,
} from "naive-ui";
import { computed, h, onMounted, ref } from "vue";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();

const storageList = ref<Storage[]>([]);
const selectedStorage = ref<string | null>(null);
const fileList = ref<StorageIndex[]>([]);
const selectedRows = ref<StorageIndex[]>([]);
const isIndexing = ref(false);
const currentPath = ref("/");

// 计算当前路径的段
const pathSegments = computed(() => {
  return currentPath.value.split("/").filter(Boolean);
});

// 获取存储节点列表
const fetchStorageList = async () => {
  storageList.value =
    await $client.pages.admin.storage.fileIndex.getAllStorage.query();
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
  })),
);

// 获取文件索引列表
const getDirectoryContents = async (path = "/") => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  try {
    fileList.value =
      await $client.pages.admin.storage.fileIndex.getDirContents.query({
        storageId: selectedStorage.value,
        path,
      });
    currentPath.value = path;
  } catch (error) {
    message.error(`获取文件索引失败: ${(error as Error).message}`);
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

// 索引选中目录
const indexSelectedPaths = async () => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  const paths = selectedRows.value.map((file) => {
    if (file.path === "/") return file.path + file.name;
    return file.path + "/" + file.name;
  });
  await indexPaths(paths);
};

// 索引整个存储
const indexEntireStorage = async () => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  await indexPaths(["/"]);
};

// 索引路径
const indexPaths = async (paths: string[]) => {
  isIndexing.value = true;
  const storageId = selectedStorage.value;
  if (!storageId) {
    message.warning("请先选择存储节点");
    return;
  }
  for (const path of paths) {
    try {
      const result = await $client.pages.admin.storage.fileIndex.scan.mutate({
        storageId: storageId,
        path,
      });
      message.success(
        `${storageId} 的 ${path} 索引完成，获取到 ${result.scannedCount} 个文件`,
      );
    } catch (error) {
      message.error(`索引失败: ${(error as Error).message}`);
    }
  }
  await getDirectoryContents(currentPath.value);
  isIndexing.value = false;
};

// 处理选中变化
const handleCheckedRowKeysChange = (keys: (string | number)[]) => {
  selectedRows.value = fileList.value.filter(
    (file) => keys.includes(file.id) && file.isDirectory,
  );
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

// 导航到根目录
const navigateToRoot = () => {
  getDirectoryContents("/");
};

// 导航到指定路径
const navigateToPath = (index: number) => {
  const path = "/" + pathSegments.value.slice(0, index + 1).join("/");
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
            },
          ),
          row.name,
        ],
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
