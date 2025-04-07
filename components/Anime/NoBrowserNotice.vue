<script lang="ts" setup>
const notification = useNotification();
notification.create({
  title: "视频兼容问题",
  description:
    "在浏览器中播放时，此视频的画面或声音可能不正常。\n如无法播放请使用外部播放器按钮、更换浏览器或下载后进行播放。",
  type: "warning",
  closable: true,
  duration: 10000,
  keepAliveOnHover: true,
});
</script>
