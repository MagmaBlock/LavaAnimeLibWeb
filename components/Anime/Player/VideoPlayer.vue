<template>
  <div
    class="relative w-full aspect-w-16 aspect-h-9 bg-black sm:rounded-md overflow-hidden select-none"
    @contextmenu.prevent
  >
    <div class="absolute top-0 w-full h-full" v-show="store.artPlayer">
      <div ref="playerContainer" id="artplayer-app" class="w-full h-full"></div>
    </div>
    <div
      class="w-full h-full bg-black text-white grid place-items-center"
      v-if="!store.artPlayer"
    >
      请选择一个可以播放的视频
    </div>
  </div>
</template>

<script lang="ts" setup>
const store = useAnimeVideoPlayerStore();

onBeforeUnmount(() => {
  store.artPlayer?.destroy();
  store.artPlayer = null;
});


// 以下代码手动实现了触摸屏长按倍速功能，因为 ArtPlayer 自身的长按倍速在按住时左右滑动会触发进度跳转，体验不好。
// 因此我们自行实现了此功能，同时也实现了在倍速时自动锁定屏幕。
// 但是由于一些事件透传问题，锁定没有效果。左右滑动依然会触发进度跳转，目前暂无解决方法。
let longPressTimer: ReturnType<typeof setTimeout> | null = null;
let touchStartTime = 0;
let stateBeforeFastForwarding = {
  playbackRate: 1,
};
let isFastForwarding = false;
const playerContainer = ref<HTMLDivElement | null>(null);

const startFastForward = () => {
  if (!store.artPlayer || store.artPlayer.isLock || isFastForwarding) return;
  setArtplayerLock(true);
  isFastForwarding = true;
  stateBeforeFastForwarding.playbackRate = store.artPlayer.playbackRate;
  store.artPlayer.playbackRate = 3.0;
};

const stopFastForward = () => {
  if (!store.artPlayer || !isFastForwarding) return;
  setArtplayerLock(false);
  isFastForwarding = false;
  store.artPlayer.playbackRate = stateBeforeFastForwarding.playbackRate;
};

const setArtplayerLock = (desiredState: boolean) => {
  if (!store.artPlayer) return;
  const currentState = store.artPlayer.isLock;
  if (currentState !== desiredState) {
    const lockElement = document.querySelector(".art-layer-lock");
    if (lockElement instanceof HTMLElement) {
      lockElement.click();
    }
  }
};

watch(playerContainer, (newElement) => {
  if (!newElement) return;

  newElement.addEventListener("touchstart", (e) => {
    touchStartTime = Date.now();
    longPressTimer = setTimeout(() => {
      startFastForward();
    }, 500);
  });

  newElement.addEventListener("touchend", () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
    if (Date.now() - touchStartTime >= 500) {
      stopFastForward();
    }
  });
});
</script>

<style scoped></style>
