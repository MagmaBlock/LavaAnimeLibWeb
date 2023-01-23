<template>
  <div v-if="!errorCode">
    <!-- 文件和集数列表 -->
    <DriveSelector :drive-list="driveList" :my-drive="myDrive" @change-drive="changeDrive" />
    <FileListLoading v-if="loading"></FileListLoading>
    <FileListMain :la-data="laData" :file-list="fileList" :selected-file="selectedFile" v-if="!loading"
      class="sm:mb-4" />
  </div>
  <div v-else>
    <AnimeBasicCard class="py-8 sm:mb-4">
      <n-result status="info" title="出现错误" :description="'错误代码: ' + errorCode"></n-result>
    </AnimeBasicCard>
  </div>
</template>

<script>
import { LavaAnimeAPI } from '@/common/api';
import AnimeBasicCard from '../../components/Anime/Cards/AnimeBasicCard.vue';
import { useStorage } from '@vueuse/core';

export default {
  inject: ["changePlayingFile"],
  props: {
    laID: Number,
    laData: Object,
    selectedFile: Object
  },
  data() {
    return {
      loading: true,
      driveList: {},
      myDrive: useStorage('myDrive', { rememberMyChoice: false, selectedDrive: '' }),
      fileList: [],
      errorCode: null
    };
  },
  mounted() {
    if (this.laID) {
      console.log("mounted 触发文件刷新");
      this.reborn();
    }
  },
  watch: {
    laID() {
      console.log("watch laID 触发文件刷新");
      this.reborn();
    }
  },
  methods: {
    // 重置函数，界面第一次挂载和参数切换时均会调用
    async reborn() {
      // 重置参数
      this.loading = true;
      this.driveList = {};
      this.fileList = [];
      // 获取资源节点相关
      this.driveList = await this.getDriveList();
      // drive ID list
      let driveIDs = this.driveList.list.map(drive => { return drive.id })
      // 如果客户端自己指定了 drive, 检查一下服务端的 driveList 里还有没有指定的 drive
      if (this.myDrive.rememberMyChoice && driveIDs.includes(this.myDrive.selectedDrive)) { }
      else { // 如果客户端(被迫)使用默认节点
        this.myDrive.selectedDrive = this.driveList.default || this.driveList.list[0].id;
      }
      // 获取相应资源节点下的资源相关
      this.fileList = await this.getFileList(this.laID, this.myDrive.selectedDrive);
      // 结束
      this.loading = false;
    },
    async getDriveList() {
      try {
        let driveList = (await LavaAnimeAPI.get("/v2/drive/all")).data;
        console.log(`Got DriveList`, driveList);
        return driveList.data;
      }
      catch (error) {
        console.error("获取存储节点列表时发生错误: ", error);
        this.errorCode = error.response?.status;
        return {};
      }
    },
    async getFileList(laID, drive) {
      try {
        let result = (await LavaAnimeAPI.get("/v2/anime/file", { params: { id: laID, drive: drive } })).data;
        console.log(`Got FileList of la${this.laID}:`, result);
        return result.data;
      }
      catch (error) {
        console.error("获取视频文件列表时发生错误: ", error);
        this.errorCode = error.response?.status;
        return [];
      }
    },
    async changeDrive(newDrive) {
      if (this.myDrive.selectedDrive == newDrive)
        return;
      this.myDrive.selectedDrive = newDrive;
      this.loading = true;
      this.changePlayingFile({});
      this.fileList = await this.getFileList(this.laID, this.myDrive.selectedDrive);
      this.loading = false;
    }
  },
  components: { AnimeBasicCard }
}
</script>