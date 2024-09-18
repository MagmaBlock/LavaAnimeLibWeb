<template>
  <div
    class="grid place-items-center w-11 h-11 rounded-lg transition hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 active:opacity-75 select-none"
    :class="
      active
        ? 'text-blue-600 dark:text-blue-500'
        : 'text-zinc-500 dark:text-zinc-400'
    "
  >
    <NTooltip v-if="name" trigger="hover" placement="right">
      <template #trigger>
        <NIcon :size="28">
          <slot name="icon" />
        </NIcon>
      </template>
      {{ name }}
    </NTooltip>
    <NIcon v-else :size="28">
      <slot name="icon" />
    </NIcon>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  name?: string;
  active?: boolean;
}>();
</script>
