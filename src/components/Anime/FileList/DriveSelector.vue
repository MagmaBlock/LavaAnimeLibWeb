<template>
  <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="driveList.list">
    <div class="text-base px-0.5 mb-2">节点</div>
    <div class="flex gap-1 overflow-x-scroll">
      <div class="w-fit h-10 px-4 rounded grid place-items-center whitespace-nowrap
        transition-all cursor-pointer" :class="selectedDrive == drive.id ? activeClass : normalClass"
        @click="changeDrive(drive.id)" v-for="drive in driveList.list">
        {{ drive.name }}
      </div>
    </div>
  </AnimeBasicCard>
</template>

<script>
import AnimeBasicCard from '../AnimeBasicCard.vue';

export default {
  inject: ['changePlayingFile'],
  emits: ['changeDrive'],
  props: {
    driveList: Object,
    selectedDrive: String
  },
  computed: {
    activeClass() {
      return 'bg-blue-600 text-white'
    },
    normalClass() {
      return 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 active:bg-blue-600 active:text-white'
    }
  },
  methods: {
    changeDrive(drive) { // 改变 Drive
      console.log('改变 Drive: ', drive);
      this.$emit('changeDrive', drive)
      // this.changePlayingFile({}, false)
    }
  },
  watch: {},
  mounted() { },
  components: { AnimeBasicCard }
}
</script> 