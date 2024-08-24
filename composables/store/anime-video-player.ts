import ArtPlayer from "artplayer";

export const useAnimeVideoPlayerStore = defineStore(
  "animeVideoPlayerStore",
  () => {
    // states
    const artPlayer = ref<ArtPlayer | null>(null);

    // actions
    function createPlayer(url?: string) {
      artPlayer.value = new ArtPlayer({
        container: "#artplayer-app",
        url: url ?? "",
        autoplay: true,
        muted: true,
        theme: "#3b82f6",
        volume: 1,
        autoMini: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        playsInline: true,
        lang: "zh-cn",
        lock: true,
        fastForward: true,
        autoOrientation: true,
        airplay: true,
      });
    }

    function setVideoUrl(url: string, autoplay = true) {
      if (!artPlayer.value) return createPlayer(url);
      artPlayer.value.switchUrl(url);
      if (autoplay) {
        artPlayer.value.once("ready", () => {
          artPlayer.value?.play();
        });
      }
    }

    // computed

    return {
      artPlayer,
      createPlayer,
      setVideoUrl,
    };
  }
);
