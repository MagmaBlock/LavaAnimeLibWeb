<template>
  <div
    class="sticky flex flex-nowrap h-12 z-10 select-none transition overflow-hidden bg-zinc-100 dark:bg-zinc-900"
  >
    <div class="flex flex-nowarp">
      <div
        class="grid place-items-center w-12 h-full text-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition cursor-pointer"
        @click="backHandler"
      >
        <Icon name="material-symbols:chevron-left" size="24" />
      </div>
      <div class="grid place-items-center h-full px-2 text-base">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["back"]);
const props = defineProps({
  title: {
    type: String,
    default: "返回",
  },
  back: {
    type: [Object, String],
  },
});

const router = useRouter();

const backHandler = () => {
  if (props.back) {
    router.push(props.back);
  } else {
    router.back(-1);
  }
};
</script>
