<template>
  <MyBasicCard class="flex mb-4 sm:mb-0 sm:px-4 h-fit sm:h-32 rounded-md select-none">
    <!-- <div class="text-xl mb-2">其他功能</div> -->
    <!-- Contents -->
    <div class="flex-1 self-center grid grid-cols-4 sm:grid-cols-4 gap-2">
      <!-- 个人设置 -->
      <BigButton @click="$router.push({ name: 'UserInfo' })">
        <template #icon>
          <i class="bi bi-person-lines-fill"></i>
        </template>
        <template #name>个人信息</template>
      </BigButton>
      <!-- 帮助 -->
      <BigButton @click="$router.push('/help')">
        <template #icon>
          <i class="bi bi-book-half"></i>
        </template>
        <template #name>使用帮助</template>
      </BigButton>
      <!-- 深色模式 -->
      <BigButton @click="$refs.darkModeModel.show = true">
        <template #icon>
          <i class="bi bi-moon-fill"></i>
        </template>
        <template #name>深色模式</template>
      </BigButton>
      <DarkModeModel ref="darkModeModel"></DarkModeModel>
      <BigButton @click="$router.push({ name: 'Update' })">
        <template #icon>
          <i class="bi bi-bar-chart-steps"></i>
        </template>
        <template #name>更新日志</template>
      </BigButton>
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