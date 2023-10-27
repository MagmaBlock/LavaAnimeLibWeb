<template><slot></slot></template>

<script setup>
// 尽管此处提供了全局的 useMessage 和 useNotification，仍应避免使用.
window.$message = useMessage();
window.$notification = useNotification();
</script>
