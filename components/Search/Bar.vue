<template>
  <div>
    <div class="flex transition-all">
      <NPopover
        trigger="manual"
        :show="showPre"
        placement="bottom"
        width="trigger"
        :show-arrow="false"
        raw
      >
        <template #trigger>
          <!-- 输入框 -->
          <input
            type="text"
            enterkeyhint="search"
            placeholder="进行搜索..."
            class="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ease-in duration-100 w-full py-1 px-2 rounded"
            @keydown="inputKeyHandler"
            @focus="focusHandler"
            @blur="
              showPre = false;
              activeValue = -1;
            "
            :value="search"
            @input="
              emits(
                'update:search',
                ($event.target as InputHTMLAttributes).value
              )
            "
          />
        </template>
        <!-- 弹出总容器 -->
        <div
          class="grid grid-cols-1 bg-white dark:bg-zinc-800 rounded overflow-hidden ring-2 ring-blue-500 select-none"
        >
          <!-- 子候选项 -->
          <span
            v-for="(value, index) in preSearchValues"
            class="py-1 px-2 whitespace-nowrap cursor-pointer"
            @pointerenter="activeValue = index"
            @pointerleave="activeValue = -1"
            @click="$emit('search', value)"
            :class="activeValue == index ? 'bg-gray-200 dark:bg-zinc-700' : ''"
          >
            <div class="text-ellipsis overflow-hidden">
              {{ value }}
            </div>
          </span>
        </div>
      </NPopover>
      <!-- 搜索按钮 -->
      <div
        class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ease-in duration-100 ml-2 rounded w-8 grid place-items-center cursor-pointer"
        @click="$emit('search', search)"
      >
        <Icon name="fluent:search-24-regular" size="16" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AxiosResponse } from "axios";
import type { InputHTMLAttributes } from "vue";

const showPre = ref(false);
const preSearchValues = ref([]);
const preSearchLock = ref(false);
const activeValue = ref(-1);
const haveFocused = ref(false);

const props = defineProps({
  search: String,
});

const emits = defineEmits(["search", "update:search"]);

watch(
  () => props.search,
  (newValue) => {
    if (newValue === null || newValue === undefined) return;
    let search = newValue.trim();
    if (search) {
      preSearch(search);
    } else {
      showPre.value = false;
      preSearchValues.value = [];
    }
  }
);

const inputKeyHandler = (key: KeyboardEvent) => {
  if (key.key == "ArrowDown") {
    key.preventDefault();
    if (activeValue.value === -1) {
      activeValue.value = 0;
      return;
    }
    if (activeValue.value < preSearchValues.value.length - 1) {
      activeValue.value++;
    } else {
      activeValue.value = -1;
    }
  }
  if (key.key == "ArrowUp") {
    key.preventDefault();
    if (activeValue.value === -1) {
      activeValue.value = preSearchValues.value.length - 1;
      return;
    }
    if (activeValue.value > 0) {
      activeValue.value--;
    } else {
      activeValue.value = -1;
    }
  }
  if (key.key == "Enter") {
    if (activeValue.value == -1) {
      emits("search", props.search);
    } else {
      emits("search", preSearchValues.value[activeValue.value]);
    }
  }
};

const focusHandler = () => {
  haveFocused.value = true;
  if (preSearchValues.value.length > 0) {
    showPre.value = true;
  }
};

const preSearch = async (value: string) => {
  value = value.trim();
  if (preSearchLock.value) return; // 如果搜索值为空或正在节流则不继续请求
  preSearchLock.value = true; // Lock
  try {
    let results: AxiosResponse = await LavaAnimeAPI.get("/v2/search/quick", {
      params: { value: value },
    });
    results = results.data;

    // 如果有结果则显示结果
    // @ts-expect-error
    if (results?.code == 200 && results.data.length > 0) {
      preSearchValues.value = results.data;
      if (haveFocused.value) showPre.value = true;
      console.log(
        `Received ${results.data.length} preSearchValues from server.`
      );
    } else {
      showPre.value = false;
      console.log("No preSearchValues, hide");
    }
  } catch (error) {
    console.error("预搜索发生错误: ", error);
  }
  setTimeout(() => {
    preSearchLock.value = false;
  }, 500); // 0.5 秒可触发一次防止网络请求阻塞
};
</script>
