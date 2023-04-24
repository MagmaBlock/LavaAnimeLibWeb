<template>
  <AnimeFlodCard class="px-4 py-2 sm:mb-4 select-none" v-if="driveList.list">
    <template #title> 节点 </template>
    <div class="grid grid-cols-1 gap-1 max-h-[35vh] overflow-y-scroll">
      <template v-for="drive in driveList.list">
        <DriveCard
          :active="myDrive.selectedDrive == drive.id"
          :name="drive.name"
          :description="drive.description"
          @click="changeDrive(drive.id)"
        />
      </template>
    </div>
    <n-checkbox
      v-model:checked="myDrive.rememberMyChoice"
      class="mt-2 mx-1"
      size="small"
    >
      记住我的选择
    </n-checkbox>
    <template #close>
      <DriveCard
        :active="true"
        :name="activeDrive?.name"
        :description="activeDrive?.description"
      />
    </template>
  </AnimeFlodCard>
</template>

<script>
import AnimeFlodCard from "../Cards/AnimeFlodCard.vue";
import DriveCard from "./DriveCard.vue";

export default {
  inject: ["changePlayingFile"],
  emits: ["changeDrive"],
  props: {
    driveList: Object,
    myDrive: Object,
  },
  methods: {
    // 改变 Drive
    changeDrive(drive) {
      console.log("改变 Drive: ", drive);
      this.$emit("changeDrive", drive);
    },
  },
  computed: {
    activeDrive() {
      return this.driveList.list.find(
        (drive) => drive?.id == this.myDrive?.selectedDrive
      );
    },
  },
  components: { AnimeFlodCard, DriveCard },
};
</script>
