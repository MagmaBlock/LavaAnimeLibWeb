<script>
import { useRegisterSW } from 'virtual:pwa-register/vue'

export default {
  name: 'ReloadPrompt',
  mixins: [useRegisterSW]
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        熔岩番剧库已离线可用.
      </span>
      <span v-else>
        新更新可用,重载以可用.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      重载
    </button>
    <button @click="close">
      关闭
    </button>
  </div>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
