<template>
  <MyBasicCard class="flex rounded-md">
    <!-- <div class="text-xl mb-2">其他功能</div> -->
    <!-- Contents -->
    <div class="flex-1 self-center grid grid-cols-4 sm:grid-cols-4 gap-2">
      <!-- 个人设置 -->
      <BigButton @click="$router.push({ name: 'UserInfo' })">
        <template #icon>
          <AccountBoxFilled />
        </template>
        <template #name>个人信息</template>
      </BigButton>
      <!-- 帮助 -->
      <BigButton @click="$router.push('/help')">
        <template #icon>
          <ArticleOutlined />
        </template>
        <template #name>使用帮助</template>
      </BigButton>
      <!-- 深色模式 -->
      <BigButton @click="$refs.darkModeModel.show = true">
        <template #icon>
          <NightsStayRound />
        </template>
        <template #name>深色模式</template>
      </BigButton>
      <DarkModeModel ref="darkModeModel"></DarkModeModel>
      <BigButton @click="$router.push({ name: 'Update' })">
        <template #icon>
          <UpdateFilled />
        </template>
        <template #name>更新日志</template>
      </BigButton>
    </div>
  </MyBasicCard>
</template>

<script>
import MyBasicCard from "./MyBasicCard.vue";
import BigButton from "./BigButton.vue";
import {
  AccountBoxFilled,
  ArticleOutlined,
  NightsStayRound,
  UpdateFilled,
} from "@vicons/material";

export default {
  data() {
    return {};
  },
  methods: {},
  components: {
    BigButton,
    MyBasicCard,
    AccountBoxFilled,
    ArticleOutlined,
    NightsStayRound,
    UpdateFilled,
  },
};
</script>
