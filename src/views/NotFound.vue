<template>
  <n-card embedded class="max-w-sm mx-auto mt-16 py-8">
    <n-result status="418" title="404" description="您访问了一个未知的界面" size="huge">
      <template #footer>
        <n-space justify="center">
          <n-button secondary type="primary">
            <RouterLink :to="{ name: 'Home' }">
              返回主页
            </RouterLink>
          </n-button>
          <n-button @click="$router.go(-1)" secondary>
            返回上一页
          </n-button>
        </n-space>
      </template>
    </n-result>
  </n-card>
</template>

<script setup>
import { inject, onUnmounted } from 'vue';

const background = inject('background')
background.value.on = true
background.value.url = 'https://dogefs.s3.ladydaily.com/~/source/unsplash/photo-1552203274-e3c7bd771d26?ixlib=rb-4.0.3&dl=toby-yang-sRy2kBQCNts-unsplash.jpg&w=1920&q=80&fmt=jpg&crop=entropy&cs=tinysrgb'

document.title = '404 | 熔岩番剧库 LavaAnimeLib'

onUnmounted(() => {
  background.value.on = false
})

</script>