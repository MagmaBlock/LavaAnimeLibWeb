<script>
import View from './views/View.vue'
export default {
  data() {
    return {};
  },
  components: { View }
}
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