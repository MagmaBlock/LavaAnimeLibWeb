<template>
  <n-list hoverable clickable bordered>
    <n-list-item v-for="commit in commits">
      <a :href="commit.html_url" target="_blank">
        <div class="font-semibold text-base">
          {{ commit.commit.message }}
        </div>
        <div class="flex items-center">
          <img
            class="h-6 object-cover rounded-full mr-2"
            :src="commit.author.avatar_url"
            alt="头像"
          />
          <div>
            {{ commit.author.login }} 提交于
            <n-time
              :time="new Date()"
              :to="new Date(commit.commit.committer.date)"
              type="relative"
            />
          </div>
        </div>
      </a>
    </n-list-item>
  </n-list>
</template>
<script>
export default {
  props: {
    commits: {
      type: Array,
      default: [],
    },
  },
};
</script>
