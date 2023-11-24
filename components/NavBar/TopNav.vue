<template>
  <div
    class="flex flex-nowrap h-12 z-10 select-none overflow-hidden bg-zinc-50 dark:bg-zinc-900 backdrop-blur-2xl bg-opacity-75 dark:bg-opacity-75 backdrop-brightness-125"
  >
    <div
      class="grid place-items-center w-12 hover:bg-zinc-200 active:scale-90 dark:hover:bg-zinc-800 transition"
      @click="backHandler"
    >
      <Icon name="material-symbols:chevron-left" size="24" />
    </div>
    <div class="grid place-items-center px-2 text-base">
      {{ title }}
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
