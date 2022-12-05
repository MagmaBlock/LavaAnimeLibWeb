<template>
  <AnimeFlodCard class="px-4 py-2 sm:mb-4 select-none" v-if="driveList.list">
    <template #title>
      节点
    </template>
    <div class="flex flex-wrap gap-1">
      <div class="w-fit h-10 px-4 rounded grid place-items-center whitespace-nowrap
        transition-all cursor-pointer" :class="selectedDrive == drive.id ? activeClass : normalClass"
        @click="changeDrive(drive.id)" v-for="drive in driveList.list">
        {{ drive.name }}
      </div>
    </div>
  </AnimeFlodCard>

</template>

<script>
import AnimeFlodCard from '../Cards/AnimeFlodCard.vue';

export default {
  inject: ['changePlayingFile'],
  emits: ['changeDrive'],
  data() {
    return {
    }
  },
  props: {
    driveList: Object,
    selectedDrive: String,
  },
  computed: {
    activeClass() {
      return 'bg-blue-600 text-white'
    },
    normalClass() {
      return 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 active:bg-blue-600 active:text-white'
    },

  },
  methods: {
    changeDrive(drive) { // 改变 Drive
      console.log('改变 Drive: ', drive);
      this.$emit('changeDrive', drive)
      // this.changePlayingFile({}, false)
    }
  },
  watch: {},
  components: { AnimeFlodCard }
}
</script> 