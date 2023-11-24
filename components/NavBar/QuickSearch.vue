<template>
  <div>
    <SearchBar
      v-model:search="searchValue"
      @search="
        (value) => router.push({ name: 'search-value', params: { value } })
      "
    />
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const searchValue = ref("");
// const emits = defineEmits(["close"]);

// const onSearch = (value: string) => {
//   router.push({ name: "search-value", params: { value } });
//   emits("close");
// };
</script>

<style></style>
