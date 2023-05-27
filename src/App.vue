<script>
import View from "./views/View.vue";
import ReloadPrompt from './components/ReloadPrompt.vue';

export default {
  data() {
    return {};
  },
  components: { View },
};
</script>

<template>
  <ReloadPrompt />
  <ThemeProvier>
    <n-notification-provider>
      <n-message-provider>
        <View />
      </n-message-provider>
    </n-notification-provider>
  </ThemeProvier>
</template>
