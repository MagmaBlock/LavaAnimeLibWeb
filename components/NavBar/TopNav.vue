<template>
  <div
    ref="navBarRef"
    class="flex flex-nowrap h-12 z-10 select-none overflow-hidden"
    :class="
      blur
        ? 'bg-zinc-50 dark:bg-zinc-900 backdrop-blur-2xl bg-opacity-75 dark:bg-opacity-75 backdrop-brightness-125'
        : 'bg-zinc-50 dark:bg-zinc-900'
    "
  >
    <div
      class="grid place-items-center hover:bg-zinc-200 active:opacity-50 dark:hover:bg-zinc-800 transition"
      :class="{ 'w-full': width < 128, 'w-12': width >= 128 }"
      @click="handleBack"
    >
      <Icon name="material-symbols:chevron-left" size="24"></Icon>
    </div>
    <div v-if="width >= 128" class="grid place-items-center px-2 text-base">
      {{ title ?? "返回" }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from "@vueuse/core";

const emit = defineEmits<{
  (e: "back"): void;
}>();

const props = defineProps<{
  title?: string;
  customBack?: boolean;
  blur?: boolean;
}>();

const router = useRouter();

const navBarRef = ref(null);
const { width } = useElementSize(navBarRef);

const handleBack = () => {
  if (props.customBack) {
    emit("back");
  } else {
    router.back();
  }
};
</script>
