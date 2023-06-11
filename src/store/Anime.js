import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { LavaAnimeAPI, getToken } from "../common/api";
import axios from "axios";
import config from "../common/config";

export const useAnimeStore = defineStore("anime", {
  state: () => {
    return {
      laID: null,
      state: {
        animeData: {
          isLoading: true,
          errorCode: null,
          errorMessage: null,
        },
        driveData: {
          isLoading: true,
          errorCode: null,
          errorMessage: null,
        },
        fileData: {
          isLoading: true,
          errorCode: null,
          errorMessage: null,
        },
        driveLoading: null,
      },
      animeData: {},
      driveData: {
        default: null,
        list: [],
      },
      myDrive: useStorage("myDrive", {
        rememberMyChoice: false,
        selectedDrive: null,
      }),
      fileData: {
        activeEpisode: null,
        activeFileIndex: null,
        fileList: [],
      },
      artInstance: null,
      showArtPlayer: false,
    };
  },
  getters: {
    bgmID: (state) => {
      return state.animeData?.bgmID ?? null;
    },
    activeFile: (state) => {
      return state.fileData.fileList[state.fileData.activeFileIndex];
    },
    activeDrive: (state) => {
      // 开启了记住选择 返回曾经的选择
      if (state.myDrive.rememberMyChoice && state.myDrive.selectedDrive) {
        return state.driveData.list.find((drive) => {
          return state.myDrive.selectedDrive == drive.id;
        });
      } else if (state.myDrive.selectedDrive) {
        return state.driveData.list.find((drive) => {
          return state.myDrive.selectedDrive == drive.id;
        });
      } else {
        // 返回默认
        return state.driveData.list.find((drive) => {
          return state.driveData?.default == drive.id;
        });
      }
    },
    // 获取集数和集数对应的视频
    episodeList: (state) => {
      let result = [];
      for (let file of state.fileData.fileList) {
        // 只要解析出集数的视频文件
        if (
          file.type == "file" &&
          file.parseResult?.extensionName?.type == "video" &&
          file.parseResult?.episode
        ) {
          let thisEpObj = result.find(
            (ep) => ep.episode == file.parseResult?.episode
          );
          // 当 Array.find 找不到时, 它将返回 undefined
          if (thisEpObj === undefined) {
            result.push({ episode: file.parseResult.episode, list: [file] });
          } else {
            thisEpObj.list.push(file); // 此处 thisEpObj 是指向 result 中对象的引用
          }
        }
      }
      // 对集数进行排序
      result.sort((a, b) => {
        const aEp = new String(a.episode);
        const bEp = new String(b.episode);
        return (
          parseInt(aEp.match(/\d+/)[0]) - parseInt(bEp.match(/\d+/)[0]) ||
          aEp.length - bEp.length
        );
      });
      return result;
    },
    noEpisodeList: (state) => {
      return state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          file.parseResult?.extensionName?.type == "video" &&
          !file.parseResult?.episode
        );
      });
    },
    musicList: (state) => {
      return state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          file.parseResult?.extensionName?.type == "music"
        );
      });
    },
    otherList: (state) => {
      return state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          !["video", "music"].includes(file.parseResult?.extensionName?.type)
        );
      });
    },
    /**
     * 提供集数, 返回指定集数的视频列表
     * @param {String} episode
     * @returns {Object}
     */
    episodeListFind(state) {
      return (episode) => {
        return this.episodeList.find((epObj) => {
          return epObj.episode == episode;
        });
      };
    },
    isNoBrowser() {
      return (
        this.activeFile?.parseResult?.noBrowser ||
        this.activeFile?.parseResult?.extensionName?.raw == "mkv"
      );
    },
    /**
     * 查找下一个集数, 可能为空
     * @param {String | undefined} episode
     * @returns {String | undefined}
     */
    findNextEpisode(state) {
      return (episode) => {
        if (typeof episode != "string") episode = this.fileData.activeEpisode;
        let currentIndex = this.episodeList.findIndex((findEp) => {
          return findEp.episode == episode;
        });
        return this.episodeList[currentIndex + 1]?.episode;
      };
    },
  },
  actions: {
    /**
     * 初始化界面, 自动获取所有数据
     * @param {Number} laID
     * @returns {Promise}
     */
    async buildPage(laID) {
      this.laID = parseInt(laID);
      this.getAnimeData(laID);
      await (async () => {
        await this.getDriveData();
        await this.getFileData(this.laID, this.activeDrive.id);
        await this.autoPlay();
      })();
    },
    async getAnimeData(laID) {
      this.state.animeData = {
        isLoading: true,
        errorCode: null,
        errorMessage: null,
      };
      this.animeData = {};

      try {
        let result = await LavaAnimeAPI.get("/v2/anime/get", {
          params: { id: laID, full: true },
        });
        this.animeData = result.data.data;
      } catch (error) {
        console.log("获取信息时发生", error, "错误");
        this.state.animeData.errorCode = error.response.status;
        this.state.animeData.errorMessage = error.response?.data?.message;
      } finally {
        this.state.animeData.isLoading = false;
      }
    },
    async getDriveData() {
      this.state.driveData = {
        isLoading: true,
        errorCode: null,
        errorMessage: null,
      };
      this.driveData = {
        default: null,
        list: [],
      };
      try {
        let result = await LavaAnimeAPI.get("/v2/drive/all");
        this.driveData = result.data.data;
        if (!this.myDrive.rememberMyChoice) {
          this.myDrive.selectedDrive = null;
        }
      } catch (error) {
        console.log("获取存储节点信息时发生", error, "错误");
        this.state.driveData.errorCode = error.response.status;
        this.state.driveData.errorMessage = error.response?.data?.message;
      } finally {
        this.state.driveData.isLoading = false;
      }
    },
    async getFileData(laID, drive) {
      this.state.driveLoading = drive; // Loading
      this.showArtPlayer = false;
      this.fileData = {
        activeEpisode: null,
        activeFileIndex: null,
        fileList: [],
      };
      this.state.fileData = {
        isLoading: true,
        errorCode: null,
        errorMessage: null,
      };
      try {
        let result = await LavaAnimeAPI.get("/v2/anime/file", {
          params: { id: laID, drive: drive },
        });
        this.fileData.fileList = result.data.data;
      } catch (error) {
        console.log("获取文件列表时发生", error, "错误");
        this.state.fileData.errorCode = error?.response?.status ?? error.code;
        this.state.fileData.errorMessage =
          error?.response?.data?.message ?? error.message;
      } finally {
        this.showArtPlayer = true;
        this.state.fileData.isLoading = false;
        this.state.driveLoading = null; // End loading
      }
    },
    /**
     * 通过节点 ID 切换当前节点
     * @param {String} newDrive 节点 ID
     */
    async changeDrive(newDrive) {
      await this.getFileData(this.laID, newDrive);
      this.myDrive.selectedDrive = newDrive; // 持久化保存
      this.selectedDrive = newDrive;
      this.autoPlay();
    },
    /**
     * 切换当前选择的集数, 会优先选择浏览器支持的视频
     * @param {String} newEpisode
     */
    changeEpisode(newEpisode) {
      if (!this.episodeListFind(newEpisode)) return;
      this.fileData.activeEpisode = newEpisode;
      // 查找当前集数下合适的视频资源
      const findResult = (findBetter = true) => {
        return this.fileData.fileList.findIndex((file) => {
          return (
            file?.parseResult?.episode == newEpisode &&
            file?.parseResult?.extensionName?.type == "video" &&
            (findBetter ? file?.parseResult.noBrowser === false : true) // 优先找浏览器兼容
          );
        });
      };
      this.fileData.activeFileIndex =
        findResult() != -1 ? findResult() : findResult(false);
    },
    /**
     * 通过视频 URL 更改活跃视频
     * @param {String} newVideoUrl
     */
    changeVideo(newVideoUrl, noEp = false) {
      this.fileData.activeFileIndex = this.fileData.fileList.findIndex(
        (file) => {
          return file?.url == newVideoUrl;
        }
      );
      if (this.activeFile?.parseResult?.episode && !noEp) {
        this.fileData.activeEpisode = this.activeFile?.parseResult?.episode;
      }
    },
    /**
     * 上报播放情况
     */
    async reportView(isWebPlayer, watchMethod) {
      let content = {
        animeID: this.laID,
        fileName: this.activeFile?.name,
        currentTime: isWebPlayer ? this.artInstance?.currentTime : null,
        totalTime: isWebPlayer ? this.artInstance?.duration : null,
        watchMethod,
        useDrive: this.activeDrive?.id,
      };
      try {
        await axios.post("/v2/anime/history/report", content, {
          baseURL: config.api.lavaAnime,
          headers: {
            Authorization: getToken(),
          },
          timeout: 3000,
        });
      } catch (error) {
        console.error("播放进度上报失败", content, error);
      }
    },
    /**
     * 自动选择一个合适的集数并播放
     */
    async autoPlay() {
      let viewHistory;
      try {
        viewHistory = await LavaAnimeAPI.post("/v2/anime/history/my", {
          animeID: this.laID,
        });
      } catch (error) {}

      // 如果服务器上有播放历史
      if (viewHistory?.data?.data?.length) {
        let lastFile = viewHistory.data.data[0];
        let findThisFile = this.fileData.fileList.findIndex((file) => {
          return file?.name == lastFile.fileName;
        });
        if (findThisFile !== -1) {
          console.log(
            "匹配到和上次播放完全相同的文件",
            this.fileData.fileList[findThisFile]
          );
          this.changeVideo(this.fileData.fileList[findThisFile]?.url);
        } else {
          console.log("上次播放的文件找不到, 使用同话数...", lastFile?.episode);
          this.changeEpisode(lastFile?.episode);
        }
        this.artInstance.once("video:canplaythrough", (e) => {
          if (lastFile.currentTime) {
            this.artInstance.video.currentTime = lastFile.currentTime;
            const ep = lastFile.episode ? `第${lastFile.episode}话` : "未知话";
            const m = Math.floor(lastFile.currentTime / 60);
            const s = lastFile.currentTime % 60;
            $message.info(`上次播放到 ${ep} ${m}:${s}, 已自动跳转`, 5000);
          }
        });
      } else {
        // 没有任何文件, 放弃自动播放
        if (!this.fileData.fileList.length) return;
        // 如果能识别到集数列表, 自动选择第一个集数播放
        if (this.episodeList.length) {
          this.changeEpisode(this.episodeList[0].episode);
        }
        // 没有集数列表, 播放第一个视频
        else {
          this.changeVideo(this.fileData.fileList[0]?.url);
        }
      }
    },
  },
});
