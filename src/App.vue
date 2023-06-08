<script setup>
import View from "./views/View.vue";
</script>

<template>
  <ThemeProvier>
    <n-notification-provider>
      <n-message-provider>
        <View />
      </n-message-provider>
    </n-notification-provider>
  </ThemeProvier>
</template>
