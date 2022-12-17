<template>
  <MyBasicCard class="flex sm:px-4 h-fit sm:h-32 rounded-md select-none">
    <!-- <div class="text-xl mb-2">其他功能</div> -->
    <!-- Contents -->
    <div class="flex-1 self-center grid grid-cols-2 sm:grid-cols-3 gap-2">
      <!-- 帮助 -->
      <BigButton @click="$router.push('/help')">
        <template #icon>
          <i class="bi bi-book-half"></i>
        </template>
        <template #name>番剧库使用帮助</template>
      </BigButton>
      <!-- 深色模式 -->
      <BigButton @click="$refs.darkModeModel.show = true">
        <template #icon>
          <i class="bi bi-moon-fill"></i>
        </template>
        <template #name>深色模式</template>
      </BigButton>
      <DarkModeModel ref="darkModeModel"></DarkModeModel>
    </div>
  </MyBasicCard>
</template>

<script>
import MyBasicCard from './MyBasicCard.vue';
import BigButton from './BigButton.vue';

export default {
  data() {
    return {}
  },
  methods: {},
  components: { BigButton, MyBasicCard }
}
</script>