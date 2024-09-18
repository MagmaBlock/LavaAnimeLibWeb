<template>
  <NCard :bordered="false" embedded>
    <!-- Contents -->
    <div class="flex-1 self-center grid grid-cols-4 sm:grid-cols-4 gap-2">
      <!-- 用户设置 -->
      <UserFunctionsCardBigButton @click="router.push('/user/setting/avatar')">
        <template #icon="iconProps">
          <Icon name="material-symbols:checkbook" :size="iconProps.size" />
        </template>
        <template #name>用户设置</template>
      </UserFunctionsCardBigButton>
      <!-- 深色模式 -->
      <UserFunctionsCardBigButton @click="showDarkModeModel = true">
        <template #icon="iconProps">
          <Icon name="material-symbols:dark-mode" :size="iconProps.size" />
        </template>
        <template #name>深色模式</template>
      </UserFunctionsCardBigButton>
      <UserFunctionsCardDarkModeModel v-model:show="showDarkModeModel" />
      <!-- 使用帮助 -->
      <UserFunctionsCardBigButton @click="router.push('/help')">
        <template #icon="iconProps">
          <Icon name="material-symbols:help" :size="iconProps.size" />
        </template>
        <template #name>使用帮助</template>
      </UserFunctionsCardBigButton>
      <!-- 更新日志 -->
      <UserFunctionsCardBigButton @click="router.push('/about/update')">
        <template #icon="iconProps">
          <Icon name="material-symbols:edit-document" :size="iconProps.size" />
        </template>
        <template #name>更新日志</template>
      </UserFunctionsCardBigButton>
    </div>
  </NCard>
</template>

<script setup>
const showDarkModeModel = ref(false);

const router = useRouter();
</script>
