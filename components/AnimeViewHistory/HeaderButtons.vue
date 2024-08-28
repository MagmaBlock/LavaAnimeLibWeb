<template>
  <div>
    <NButtonGroup>
      <!-- 全视图模式下的按钮 -->
      <template v-if="isFullView">
        <NButton secondary size="small" @click="toggleDeleteMode">
          <template #icon>
            <Icon
              :name="
                isDeleteMode
                  ? 'material-symbols:exit-to-app'
                  : 'material-symbols:delete'
              "
            />
          </template>
          {{ isDeleteMode ? "退出删除" : "删除模式" }}
        </NButton>
        <NButton
          secondary
          size="small"
          @click="refreshData"
          :loading="status === 'pending'"
        >
          <template #icon>
            <Icon name="material-symbols:refresh" />
          </template>
          刷新
        </NButton>
      </template>
      <!-- 非全视图模式下的按钮 -->
      <template v-else>
        <NButton
          secondary
          size="small"
          @click="refreshData"
          :loading="status === 'pending'"
        >
          <template #icon>
            <Icon
              name="material-symbols:refresh"
              :class="status === 'pending' ? 'animate-spin' : ''"
            />
          </template>
          刷新
        </NButton>
        <NButton secondary size="small" @click="router.push('/user/history')">
          <template #icon>
            <Icon name="material-symbols:chevron-right" />
          </template>
          详情
        </NButton>
      </template>
    </NButtonGroup>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isFullView?: boolean;
  isDeleteMode?: boolean;
  status?: string;
}>();

const emit = defineEmits<{
  (e: "toggleDeleteMode"): void;
  (e: "refreshData"): void;
}>();

const router = useRouter();

const toggleDeleteMode = () => {
  emit("toggleDeleteMode");
};

const refreshData = () => {
  emit("refreshData");
};
</script>

<style></style>
