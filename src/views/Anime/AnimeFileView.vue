<template>
  <!-- 文件和集数列表 -->
  <DriveSelector :drive-list="driveList" :selected-drive="selectedDrive" @change-drive="changeDrive" />
  <FileListLoading v-if="loading"></FileListLoading>
  <FileListMain :la-data="laData" :file-list="fileList" :selected-file="selectedFile" v-if="!loading" class="sm:mb-4" />
</template>

<script>
import { LavaAnimeAPI } from '../../common/api';

export default {
  inject: ['changePlayingFile'],
  props: {
    laID: Number,
    laData: Object,
    selectedFile: Object
  },
  data() {
    return {
      loading: true,
      driveList: {},
      selectedDrive: '',
      fileList: []
    }
  },
  async mounted() {
    // 获取资源节点相关
    let driveListResult = await this.getDriveList();
    this.driveList = driveListResult;
    this.selectedDrive = driveListResult.default || driveListResult.list[0].id

    // 获取相应资源节点下的资源相关
    let fileListResult = await this.getFileList(this.laID, this.selectedDrive);
    this.fileList = fileListResult;

    this.loading = false
  },
  methods: {
    async getDriveList() {
      try {
        let driveList = (await LavaAnimeAPI.get('/v2/drive/all')).data;
        console.log(`Got DriveList`, driveList);
        return driveList.data
      } catch (error) {
        console.error('获取存储节点列表时发生错误: ', error)
      }
    },
    async getFileList(laID, drive) {
      try {
        let result = (await LavaAnimeAPI.get("/v2/anime/file", { params: { id: laID, drive: drive } })).data;
        console.log(`Got FileList of la${this.laID}:`, result);
        return result.data;
      } catch (error) {
        console.error('获取视频文件列表时发生错误: ', error)
      }
    },
    async changeDrive(newDrive) {
      if (this.selectedDrive == newDrive) return
      this.selectedDrive = newDrive
      this.loading = true
      this.changePlayingFile({})
      let fileListResult = await this.getFileList(this.laID, this.selectedDrive);
      this.fileList = fileListResult;
      this.loading = false
    }
  },
}
</script>