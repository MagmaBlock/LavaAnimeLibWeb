<template>
  <NFlex :wrap="false">
    <NFlex vertical size="small" class="flex-1">
      <NFlex size="small" vertical>
        <div class="font-semibold">ep.{{ episode }} {{ name }}</div>
        <div class="text-xs opacity-75">
          <span v-if="airDate"> 首播: {{ airDate }} </span>
          <span v-if="formatDuration"> 时长: {{ formatDuration }} </span>
        </div>
      </NFlex>
      <NEllipsis
        class="text-xs opacity-75"
        :line-clamp="3"
        expand-trigger="click"
      >
        <div v-html="formattedSummary"></div>
        <template #tooltip> 点击展开 </template>
      </NEllipsis>
    </NFlex>
    <div>
      <NImage
        v-if="poster"
        :src="poster"
        object-fit="cover"
        class="rounded-md w-[100px] flex-shrink-0"
      />
    </div>
  </NFlex>
</template>

<script lang="ts" setup>
const props = defineProps<{
  episode: number;
  name?: string | null;
  airDate?: string | null;
  duration?: number | null;
  summary?: string | null;
  poster?: string;
}>();

const formatDuration = computed(() => {
  if (props.duration === null || props.duration === undefined) return null;
  const hours = Math.floor(props.duration / 3600);
  const minutes = Math.floor((props.duration % 3600) / 60);
  const remainingSeconds = props.duration % 60;
  return [hours, minutes, remainingSeconds]
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
});

const formattedSummary = computed(() => {
  return props.summary ? props.summary.replace(/\n/g, "<br>") : "";
});
</script>

<style></style>
