<template>
  <NFlex vertical>
    <!-- 存储节点选择器 -->
    <NSelect
      v-model:value="selectedStorage"
      :options="storageOptions"
      placeholder="选择存储节点"
      @update:value="handleStorageChange"
    />

    <!-- 面包屑导航 -->
    <NScrollbar x-scrollable>
      <NBreadcrumb v-if="selectedStorage">
        <NBreadcrumbItem @click="navigateToRoot">根目录</NBreadcrumbItem>
        <NBreadcrumbItem
          v-for="(segment, index) in pathSegments"
          :key="index"
          @click="navigateToPath(index)"
        >
          {{ segment }}
        </NBreadcrumbItem>
      </NBreadcrumb>
    </NScrollbar>

    <!-- 文件列表表格 -->
    <NDataTable
      v-if="selectedStorage"
      :columns="columns"
      :data="filteredFileList"
      :row-key="(row) => row.id"
      @update:checked-row-keys="handleCheckedRowKeysChange"
      :checked-row-keys="selectedRows.map((row) => row.id)"
      :pagination="{
        pageSize: 8,
      }"
    />

    <!-- 已选择项目显示 -->
    <NEllipsis v-if="selectedStorage">
      <template v-if="mode === 'selectPath'">
        已选择：{{ selectedPath }}
      </template>
      <template v-else> 已选择：{{ selectedItemsText }} </template>
    </NEllipsis>

    <!-- 操作按钮 -->
    <NFlex v-if="selectedStorage" justify="end">
      <NButton
        v-if="mode === 'selectPath'"
        @click="selectRootPath"
        type="default"
      >
        选择根目录
      </NButton>
      <NButton
        v-if="
          mode === 'selectFile' ||
          (mode === 'selectPath' && selectedRows.length > 0)
        "
        @click="confirmSelection"
        type="primary"
        :disabled="!canConfirm"
      >
        选择
      </NButton>
      <NButton
        v-if="mode === 'selectPath' && selectedRows.length === 0"
        @click="confirmPathSelection"
        type="primary"
      >
        选择当前路径
      </NButton>
    </NFlex>
  </NFlex>
</template>

<script lang="ts" setup>
import { Icon } from "#components";
import type { Storage, StorageIndex } from "@prisma/client";
import type { DataTableColumns, SelectOption } from "naive-ui";
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NDataTable,
  NIcon,
  NSelect,
  useMessage,
} from "naive-ui";
import { computed, h, ref, watch } from "vue";

// 组件属性定义
const props = defineProps<{
  mode: "selectFile" | "selectPath";
  multiple?: boolean;
  fileOnly?: boolean;
  folderOnly?: boolean;
}>();

// 事件发射器定义
const emit = defineEmits<{
  (e: "update:selectedFiles", value: StorageIndex[]): void;
  (e: "update:selectedPath", value: string): void;
  (e: "update:selectedStorage", value: string | null): void;
}>();

const { $client } = useNuxtApp();
const message = useMessage();

// 响应式状态变量
const storageList = ref<Storage[]>([]);
const selectedStorage = ref<string | null>(null);
const fileList = ref<StorageIndex[]>([]);
const selectedRows = ref<StorageIndex[]>([]);
const currentPath = ref("/");
const selectedPath = ref("/");

// 计算属性：当前路径段
const pathSegments = computed(() => {
  return currentPath.value.split("/").filter(Boolean);
});

// 计算属性：存储节点选项
const storageOptions = computed<SelectOption[]>(() =>
  storageList.value.map((storage) => ({
    label: `[${storage.type}] ${storage.name} (${storage.id})${
      storage.description ? " - " + storage.description : ""
    }`,
    value: storage.id,
  }))
);

// 计算属性：根据条件过滤文件列表
const filteredFileList = computed(() => {
  if (props.fileOnly) {
    return fileList.value.filter((file) => !file.isDirectory);
  } else if (props.folderOnly) {
    return fileList.value.filter((file) => file.isDirectory);
  }
  return fileList.value;
});

// 计算属性：是否可以确认选择
const canConfirm = computed(() => {
  if (props.mode === "selectFile") {
    if (props.fileOnly)
      return selectedRows.value.every((row) => !row.isDirectory);
    if (props.folderOnly)
      return selectedRows.value.every((row) => row.isDirectory);
    return selectedRows.value.length > 0;
  }
  if (props.mode === "selectPath") {
    return true; // 允许选择当前路径
  }
  return false;
});

// 计算属性：已选择项目的文本描述
const selectedItemsText = computed(() => {
  if (selectedRows.value.length === 0) {
    return "未选择任何项目";
  } else if (selectedRows.value.length <= 2) {
    return selectedRows.value.map((row) => row.name).join("、");
  } else {
    return `${selectedRows.value[0].name}、${selectedRows.value[1].name} 等共 ${selectedRows.value.length} 个项目`;
  }
});

// 表格列定义
const columns: DataTableColumns<StorageIndex> = [
  {
    type: "selection",
    multiple: props.multiple,
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
              handleFolderClick(row);
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

// 获取存储节点列表
const fetchStorageList = async () => {
  storageList.value =
    await $client.components.admin.storage.pathSelector.getAllStorage.query();
  if (storageList.value.length > 0) {
    selectedStorage.value = storageList.value[0].id;
    await handleStorageChange(selectedStorage.value);
  }
};

// 获取目录内容
const getDirectoryContents = async (path = "/") => {
  if (!selectedStorage.value) {
    message.warning("请先选择存储节点");
    return;
  }
  try {
    fileList.value =
      await $client.components.admin.storage.pathSelector.getPathContents.query(
        {
          storageId: selectedStorage.value,
          path,
        }
      );
    currentPath.value = normalizePath(path);
    selectedRows.value = []; // 清空用户的选择
    updateSelectedPath();
  } catch (error) {
    message.error(`获取目录内容失败: ${(error as Error).message}`);
  }
};

// 处理存储节点变更
const handleStorageChange = async (value: string | null) => {
  selectedStorage.value = value;
  emit("update:selectedStorage", value);
  if (value) {
    await getDirectoryContents();
  } else {
    fileList.value = [];
    currentPath.value = "/";
    selectedRows.value = []; // 清空用户的选择
    updateSelectedPath();
  }
};

// 处理选中行变更
const handleCheckedRowKeysChange = (keys: (string | number)[]) => {
  selectedRows.value = fileList.value.filter((file) => keys.includes(file.id));
  updateSelectedPath();
};

// 处理文件夹点击
const handleFolderClick = (row: StorageIndex) => {
  getDirectoryContents(normalizePath(row.path + "/" + row.name));
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

// 确认选择
const confirmSelection = () => {
  if (props.mode === "selectFile") {
    emit("update:selectedFiles", selectedRows.value);
  } else if (props.mode === "selectPath") {
    emit("update:selectedPath", selectedPath.value);
  }
};

// 确认当前路径选择
const confirmPathSelection = () => {
  emit("update:selectedPath", currentPath.value);
};

// 选择根路径
const selectRootPath = () => {
  emit("update:selectedPath", "/");
};

// 更新选中路径
const updateSelectedPath = () => {
  if (selectedRows.value.length > 0) {
    const row = selectedRows.value[0];
    selectedPath.value = normalizePath(
      row.isDirectory ? row.path + "/" + row.name : row.path
    );
  } else {
    selectedPath.value = currentPath.value;
  }
};

// 规范化路径
const normalizePath = (path: string): string => {
  return "/" + path.split("/").filter(Boolean).join("/");
};

// 监听模式变化
watch(
  () => props.mode,
  () => {
    selectedRows.value = [];
    updateSelectedPath();
  }
);

// 初始化：获取存储节点列表
fetchStorageList();
</script>
