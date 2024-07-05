<template>
  <div v-if="count" class="flex place-items-center gap-1">
    <Icon icon="material-symbols:stack" />
    <div>共 {{ count }} {{ store.getColorEgg?.episodeName ?? "话" }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  count: Number,
});

const store = useAnimeStore();
</script>

<style></style>
