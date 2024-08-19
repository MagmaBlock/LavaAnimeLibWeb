<template>
  <div class="flex overflow-x-scroll md:flex-wrap gap-2">
    <AnimeIndexFilterControlCheckableButton
      v-if="showNoneSelectedButton"
      :title="noneSelectedButtonText ?? '全部'"
      :checked="selected.length === 0"
      @click="handleClearClick"
    />
    <AnimeIndexFilterControlCheckableButton
      v-for="item in items"
      :key="item.value"
      :title="item.label || item.value"
      :checked="selected.includes(item.value)"
      @click="handleClick(item.value)"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  items: { value: string; label: string }[];
  selected: string[];
  multiple: boolean;
  noneSelectedButtonText?: string;
  showNoneSelectedButton?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:selected", value: string[]): void;
}>();

const handleClick = (itemId: string) => {
  const selected = [...props.selected];
  if (props.multiple) {
    if (selected.includes(itemId)) {
      selected.splice(selected.indexOf(itemId), 1);
    } else {
      selected.push(itemId);
    }
  } else {
    emit("update:selected", selected.includes(itemId) ? [] : [itemId]);
    return;
  }
  emit("update:selected", selected);
};

const handleClearClick = () => {
  emit("update:selected", []);
};
</script>

<style></style>
