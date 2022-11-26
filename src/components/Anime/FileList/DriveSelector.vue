<template>
  <AnimeBasicCard class="px-4 py-2 sm:mb-4 select-none" v-if="driveList.list">
    <div class="text-base px-0.5">
      节点
      <RoundedButton class="float-right px-2" @click="openTab = !openTab">
        <i class="bi bi-chevron-up" v-show="openTab"></i>
        <i class="bi bi-chevron-down" v-show="!openTab"></i>
      </RoundedButton>
    </div>
    <n-collapse-transition :show="openTab">
      <div class="flex flex-wrap gap-1 mt-2">
        <div class="w-fit h-10 px-4 rounded grid place-items-center whitespace-nowrap
        transition-all cursor-pointer" :class="selectedDrive == drive.id ? activeClass : normalClass"
          @click="changeDrive(drive.id)" v-for="drive in driveList.list">
          {{ drive.name }}
        </div>
      </div>
    </n-collapse-transition>
  </AnimeBasicCard>
</template>

<script>
import AnimeBasicCard from '../AnimeBasicCard.vue';
import RoundedButton from './RoundedButton.vue';

export default {
  inject: ['changePlayingFile'],
  emits: ['changeDrive'],
  data() {
    return {
      openTab: false
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
  mounted() {
    if (document.body.clientWidth >= 1024) this.openTab = true // 在 PC 端默认展开
  },
  components: { AnimeBasicCard, RoundedButton }
}
</script> 