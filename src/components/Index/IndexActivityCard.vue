<template>
  <Transition name="fade">
    <div v-if="store.activityCard.enable">
      <div class="h-[0.5px] bg-gray-200 dark:bg-gray-700 my-6"></div>
      <a
        :href="store.activityCard.link.url"
        target="_blank"
        v-if="store.activityCard.link.enable"
      >
        <img
          :src="store.activityCard.image"
          class="rounded-md transition active:scale-95 hover:brightness-110"
        />
      </a>
      <img
        v-else
        :src="store.activityCard.image"
        class="rounded-md transition active:scale-95 hover:brightness-110"
      />
    </div>
  </Transition>
</template>

<script setup>
import { useIndexStore } from "../../store/Index";

const store = useIndexStore();

store.getActivity();
</script>
