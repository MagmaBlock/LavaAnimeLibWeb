<template>
  <BasicCard class="px-4 py-2 select-none" v-if="la.relations && la.relations[0]">
    <div class="text-lg">
      相关作品
    </div>
    <div v-for="anime in la.relations" class="flex flex-wrap gap-1 my-2">
      <RouterLink :to="'/anime/' + anime.id">
        <div class="bg-gray-100 active:bg-gray-300 cursor-pointer ease-in duration-200 rounded p-2">
          <span class="bg-blue-100 text-xs text-blue-600 font-medium rounded-sm px-1.5 mr-1">
            {{ anime.relation }}
          </span>
          <span class="">
            {{ anime.title }}
          </span>
          <span v-if="anime.type.bdrip" class="bg-blue-100 text-xs text-blue-600 font-medium rounded-sm px-1.5 mx-0.5">
            BDRip
          </span>
          <span v-if="anime.type.nsfw"
            class="bg-yellow-100 text-xs text-yellow-600 font-medium rounded-sm px-1.5 mx-0.5">
            NSFW
          </span>
        </div>
      </RouterLink>
    </div>
  </BasicCard>
</template>

<script>
export default {
  props: {
    la: Object
  },
  data() {
    return {

    }
  }
}
</script>