import { useLocalStorage, useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import axios from "axios";
import type Artplayer from "artplayer";
import { useMessage } from "naive-ui";

// 类型定义
export interface ParseResult {
  animeTitle: string;
  animeYear: number | null;
  episode?: string;
  extensionName: {
    result: string;
    type: string;
    raw: string;
    trueName: string;
  };
  fileName: string;
  groups: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  noBrowser?: boolean;
  videoSource?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  videoQuality?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  videoSubtitle?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
}

export type FileData = Array<{
  name: string;
  size: number;
  updated: string;
  driver: string;
  thumbnail: string;
  type: string;
  url?: string;
  parseResult: ParseResult;
  animeTitle: string;
  animeYear: number | null;
  episode?: string;
  extensionName: {
    result: string;
    type: string;
    raw: string;
    trueName: string;
  };
  fileName: string;
  groups: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  noBrowser?: boolean;
  videoSource?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  videoQuality?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
  videoSubtitle?: Array<{
    result: string;
    raw: string;
    type: string;
  }>;
}>;

export type AnimeData = {
  date: string;
  platform: string;
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
    common: string;
    poster: string;
  };
  summary: string;
  name: string;
  name_cn: string;
  tags: string[];
  bgmID: number;
  rating: {
    rank: number;
    total: number;
    count: {
      "1": number;
      "2": number;
      "3": number;
      "4": number;
      "5": number;
      "6": number;
      "7": number;
      "8": number;
      "9": number;
      "10": number;
    };
    score: number;
  };
  infobox: any[];
  total_episodes: number;
  collection: {
    on_hold: number;
    dropped: number;
    wish: number;
    collect: number;
    doing: number;
  };
  id: number;
  type: {
    bdrip: boolean;
    nsfw: boolean;
  };
  rating_count: number;
  rank: number;
  popularity: number;
  favorites: number;
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch: number;
  characters: any[];
};

export type DriveData = {
  default: string;
  list: {
    id: string;
    name: string;
    type: string;
    status: string;
    capacity: number;
    used: number;
    available: number;
    lastUpdate: string;
  }[];
};

declare global {
  interface Window {
    $message: ReturnType<typeof useMessage>;
  }
}

export const useAnimeStore = defineStore("anime", {
  state: () => {
    return {
      laID: 0 as number,
      state: {
        animeData: {
          isLoading: true,
          errorCode: null as number | null,
          errorMessage: null as string | null,
        },
        driveData: {
          isLoading: true,
          errorCode: null as number | null,
          errorMessage: null as string | null,
        },
        fileData: {
          isLoading: true,
          errorCode: null as number | null,
          errorMessage: null as string | null,
        },
        driveLoading: null as string | null,
      },
      animeData: null as AnimeData | null,
      driveData: null as DriveData | null,
      myDrive: useStorage("myDrive", {
        rememberMyChoice: false,
        selectedDrive: null as string | null,
      }),
      fileData: {
        activeEpisode: null as string | null,
        activeFileIndex: null as number | null,
        fileList: [] as FileData,
      },
      // 字幕相关状态
      subtitleData: {
        enabled: true, // 字幕开关状态
        subtitleFileName: null as string | null,
      },
      artInstance: null as Artplayer | null,
      showArtPlayer: false,
      showAdminTools: false,
      ascOrder: useLocalStorage("AnimeFileAscOrder", true),
      // 部分番剧的界面彩蛋
      colorEgg: [
        {
          bgmID: 484761,
          episodeName: "头",
          follow: {
            add: "加入小鹿部",
            remove: "逃不掉了",
          },
          fileList: {
            title: "鹿园",
          },
        },
      ],
      isFileBrowserOpen: false,
    };
  },
  getters: {
    /**
     * 获取 Bangumi ID
     */
    bgmID: (state) => {
      return state.animeData?.bgmID ?? null;
    },
    /**
     * 获得活跃文件. AnimePlayer 组件一旦创建就会 watch 此属性
     */
    activeFile: (
      state
    ): (FileData[number] & { parseResult: ParseResult }) | null => {
      if (
        state.fileData.activeFileIndex === null ||
        state.fileData.fileList === null
      )
        return null;
      const file = state.fileData.fileList[state.fileData.activeFileIndex];
      return file ? { ...file, parseResult: file.parseResult } : null;
    },
    /**
     * 获取活跃的字幕文件
     */
    activeSubtitle: (state) => {
      if (!state.subtitleData.enabled) return null;
      if (state.subtitleData.subtitleFileName === null) return null;
      return state.fileData.fileList.find(
        (file) => file.name === state.subtitleData.subtitleFileName
      );
    },
    /**
     * 获取选中的节点
     */
    activeDrive: (state) => {
      if (state.driveData === null) return null;
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
    /**
     * 获取集数和集数对应的视频
     */
    episodeList: (state) => {
      if (state.fileData.fileList === null) return [];
      let result: { episode: string; list: typeof state.fileData.fileList }[] =
        [];
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
            result.push({ episode: file.parseResult?.episode, list: [file] });
          } else {
            thisEpObj.list.push(file); // 此处 thisEpObj 是指向 result 中对象的引用
          }
        }
      }
      // 对集数进行排序
      result.sort((a, b) => {
        const aEp = String(a.episode);
        const bEp = String(b.episode);

        // 将集数拆分为整数部分和小数部分
        const [aInt, aFrac = "0"] = aEp.split(".");
        const [bInt, bFrac = "0"] = bEp.split(".");

        // 比较整数部分
        const aIntNum = parseInt(aInt);
        const bIntNum = parseInt(bInt);
        if (aIntNum !== bIntNum) {
          return aIntNum - bIntNum;
        }

        // 如果整数部分相同，比较小数部分
        const aFracNum = parseInt(aFrac);
        const bFracNum = parseInt(bFrac);
        return aFracNum - bFracNum;
      });

      if (!state.ascOrder) result.reverse();
      return result;
    },
    noEpisodeList: (state) => {
      if (state.fileData.fileList === null) return;
      let result = state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          file.parseResult?.extensionName?.type == "video" &&
          !file.parseResult?.episode
        );
      });
      if (!state.ascOrder) result.reverse();
      return result;
    },
    musicList: (state) => {
      if (state.fileData.fileList === null) return;
      let result = state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          file.parseResult?.extensionName?.type == "music"
        );
      });
      if (!state.ascOrder) result.reverse();
      return result;
    },
    otherList: (state) => {
      if (state.fileData.fileList === null) return;
      let result = state.fileData.fileList.filter((file) => {
        return (
          file.type == "file" &&
          !["video", "music"].includes(file.parseResult.extensionName.type)
        );
      });
      if (!state.ascOrder) result.reverse();
      return result;
    },
    /**
     * 获取当前集数的所有字幕文件
     */
    subtitleList(state) {
      if (state.fileData.fileList === null) return [];
      return state.fileData.fileList.filter((file) => {
        if (file?.parseResult?.extensionName?.type == "subtitle") {
          const currentEpisode = this.activeFile?.parseResult?.episode;
          if (currentEpisode == file.parseResult?.episode) return true;
        }
      });
    },
    /**
     * 提供集数, 返回指定集数的视频列表
     * @param {String} episode
     * @returns {Object}
     */
    episodeListFind(state) {
      return (episode: string) => {
        return this.episodeList?.find((epObj) => {
          return epObj.episode == episode;
        });
      };
    },
    isNoBrowser(): boolean {
      const file = this.activeFile as
        | (FileData[number] & { parseResult: ParseResult })
        | null;
      return (
        file?.parseResult?.noBrowser ||
        file?.parseResult?.extensionName?.raw == "mkv"
      );
    },
    /**
     * 查找下一个集数, 可能为空
     * @param {String | undefined} episode
     * @returns {String | undefined}
     */
    findNextEpisode(state) {
      return (episode?: string) => {
        const currentEpisode = episode || this.fileData.activeEpisode;
        if (!currentEpisode) return undefined;

        const currentIndex =
          this.episodeList?.findIndex((findEp) => {
            return findEp.episode == currentEpisode;
          }) ?? -1;

        if (currentIndex === -1 || !this.episodeList) return undefined;

        const nextEpisode = this.episodeList[currentIndex + 1]?.episode;
        console.log("当前集:", currentEpisode, "下一集:", nextEpisode);
        return nextEpisode;
      };
    },
    getColorEgg: (state) => {
      return state.colorEgg.find((egg) => egg.bgmID === state.animeData?.bgmID);
    },
  },
  actions: {
    /**
     * 初始化界面, 自动获取所有数据
     * @param laID
     * @param forceEpisode 可选, 指定要初始播放的集数
     * @returns {Promise}
     */
    async buildPage(laID: string, forceEpisode: string | null) {
      this.laID = parseInt(laID);
      this.getAnimeData(laID);
      (async () => {
        await this.getDriveData();
        if (!this.activeDrive?.id) throw new Error("No active drive selected");
        await this.getFileData(this.laID, this.activeDrive.id);
        // 如果 URL 指定了本次播放的集数
        if (forceEpisode) {
          try {
            return await this.changeEpisodeAutoHistory(forceEpisode);
          } catch (error) {
            if (error == "episodeNotFound")
              window.$message.error(
                `第 ${forceEpisode} 话不存在, 按正常情况播放`
              );
          }
        }
        await this.autoPlay();
      })();
    },
    async getAnimeData(laID: string) {
      this.state.animeData = {
        isLoading: true,
        errorCode: null,
        errorMessage: null,
      };
      this.animeData = {
        date: "",
        platform: "",
        images: {
          small: "",
          grid: "",
          large: "",
          medium: "",
          common: "",
          poster: "",
        },
        summary: "",
        name: "",
        name_cn: "",
        tags: [],
        bgmID: 0,
        rating: {
          rank: 0,
          total: 0,
          count: {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
          },
          score: 0,
        },
        infobox: [],
        total_episodes: 0,
        collection: {
          on_hold: 0,
          dropped: 0,
          wish: 0,
          collect: 0,
          doing: 0,
        },
        id: 0,
        type: {
          bdrip: false,
          nsfw: false,
        },
        rating_count: 0,
        rank: 0,
        popularity: 0,
        favorites: 0,
        watching: 0,
        completed: 0,
        on_hold: 0,
        dropped: 0,
        plan_to_watch: 0,
        characters: [],
      };

      try {
        let result = await LavaAnimeAPI.get("/v2/anime/get", {
          params: { id: laID, full: true },
        });
        this.animeData = result.data.data;
      } catch (error: any) {
        console.log("获取信息时发生", error, "错误");
        this.state.animeData.errorCode = error.response?.status;
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
        default: "",
        list: [],
      };
      try {
        let result = await LavaAnimeAPI.get("/v2/drive/all");
        this.driveData = result.data.data;
        if (!this.myDrive.rememberMyChoice) {
          this.myDrive.selectedDrive = null;
        }
      } catch (error: any) {
        console.log("获取存储节点信息时发生", error, "错误");
        this.state.driveData.errorCode = error.response?.status;
        this.state.driveData.errorMessage = error.response?.data?.message;
      } finally {
        this.state.driveData.isLoading = false;
      }
    },
    async getFileData(laID: number, drive: string) {
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
        if (this.fileData.fileList.length) {
          // 确保没有出错以及有结果才启动播放器
          this.showArtPlayer = true;
        }
      } catch (error: any) {
        console.log("获取文件列表时发生", error, "错误");
        this.state.fileData.errorCode = error?.response?.status ?? error.code;
        this.state.fileData.errorMessage =
          error?.response?.data?.message ?? error.message;
      } finally {
        this.state.fileData.isLoading = false;
        this.state.driveLoading = null; // End loading
      }
    },
    /**
     * 通过节点 ID 切换当前节点
     * @param {String} newDrive 节点 ID
     */
    async changeDrive(newDrive: string) {
      try {
        await this.getFileData(this.laID, newDrive);
        this.myDrive.selectedDrive = newDrive; // 持久化保存
        this.autoPlay();
      } catch (error) {}
    },
    /**
     * 切换当前选择的集数, 会优先选择浏览器支持的视频
     * @param newEpisode
     */
    changeEpisode(newEpisode: string): Promise<string | undefined> {
      return new Promise((resolve, reject) => {
        if (!this.episodeListFind(newEpisode)) return reject("episodeNotFound");
        // 2025年3月23日增加：优先寻找旧资源相同的字幕组
        const oldGroups = this.activeFile?.parseResult?.groups || [];
        console.log("当前发布组:", oldGroups);

        // 计算发布组相似度
        const calculateGroupSimilarity = (
          groups: Array<{ result: string }>
        ) => {
          if (!oldGroups.length) return 0;
          const matched = groups.filter((g) =>
            oldGroups.some(
              (og) =>
                og.result.toLowerCase().includes(g.result.toLowerCase()) ||
                g.result.toLowerCase().includes(og.result.toLowerCase())
            )
          );
          return matched.length / oldGroups.length;
        };

        this.fileData.activeEpisode = newEpisode;
        // 查找当前集数下合适的视频资源
        const findResult = (findBetter = true) => {
          let bestMatchIndex = -1;
          let bestSimilarity = 0;

          this.fileData.fileList.forEach((file, index) => {
            if (
              file?.parseResult?.episode == newEpisode &&
              file?.parseResult?.extensionName?.type == "video" &&
              (findBetter ? file?.parseResult?.noBrowser === false : true)
            ) {
              const similarity = calculateGroupSimilarity(
                file.parseResult.groups || []
              );
              console.log(`文件 ${file.name} 发布组相似度: ${similarity}`);

              if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatchIndex = index;
              }
            }
          });

          // 如果没有找到相似度大于0的，返回第一个匹配的文件
          if (bestSimilarity === 0) {
            return this.fileData.fileList.findIndex((file) => {
              return (
                file?.parseResult?.episode == newEpisode &&
                file?.parseResult?.extensionName?.type == "video" &&
                (findBetter ? file?.parseResult?.noBrowser === false : true)
              );
            });
          }

          return bestMatchIndex;
        };
        // 更改文件
        this.fileData.activeFileIndex =
          findResult() != -1 ? findResult() : findResult(false);

        // 当播放器可播放且当前活跃视频集数仍是本次切换的视频集数时
        if (!this.artInstance)
          throw new Error("Artplayer instance not initialized");
        this.artInstance.once("video:canplaythrough", () => {
          if (this.fileData.activeEpisode == newEpisode) {
            resolve(undefined);
          } else {
            reject("视频集数切换被其他事件中断");
          }
        });
        // 加载当前集数视频发生错误
        this.artInstance.once("error", (error) => {
          if (this.fileData.activeEpisode == newEpisode) {
            reject(error);
          }
        });
        this.autoSubtitle();
      });
    },
    /**
     * 通过视频 URL 更改活跃视频
     * @param {String} newVideoUrl
     * @param {Boolean} noEp 切换视频时不操作活跃集数. 用于播放非正片视频
     * @returns {Promise<String | Error | undefined>}
     */
    changeVideo(newVideoUrl: string, noEp = false) {
      return new Promise((resolve, reject) => {
        // 更改活跃文件的索引
        this.fileData.activeFileIndex = this.fileData.fileList.findIndex(
          (file) => {
            return file?.url == newVideoUrl;
          }
        );
        // 更改活跃集数
        if (this.activeFile?.parseResult?.episode && !noEp) {
          this.fileData.activeEpisode = this.activeFile?.parseResult?.episode;
        }

        // 当播放器可播放且当前活跃视频仍是本次切换的视频时
        if (!this.artInstance)
          throw new Error("Artplayer instance not initialized");
        this.artInstance.once("video:canplaythrough", () => {
          if (this.activeFile?.url == newVideoUrl) {
            resolve(undefined);
          } else {
            reject("视频切换被其他事件中断");
          }
        });
        // 加载当前视频发生错误
        if (!this.artInstance)
          throw new Error("Artplayer instance not initialized");
        this.artInstance.once("error", (error) => {
          if (this.activeFile?.url == newVideoUrl) {
            reject(error);
          }
        });
      });
    },
    /**
     * 获取当前番剧的播放历史记录
     */
    async getAnimeViewHistory() {
      return await LavaAnimeAPI.post("/v2/anime/history/my", {
        animeID: this.laID,
      });
    },
    /**
     * 上报播放情况
     */
    async reportView(isWebPlayer: boolean, watchMethod: string) {
      let content = {
        animeID: this.laID,
        fileName: this.activeFile?.name,
        currentTime: isWebPlayer ? this.artInstance?.currentTime : null,
        totalTime: isWebPlayer ? this.artInstance?.duration : null,
        watchMethod,
        useDrive: this.activeDrive?.id,
      };
      try {
        await LavaAnimeAPI.post("/v2/anime/history/report", content, {
          timeout: 3000,
        });
      } catch (error) {
        console.error("播放进度上报失败", content, error);
      }
    },
    /**
     * 自动选择一个合适的集数并播放，仅在每次选择节点后调用 (或首次打开番剧时)
     */
    async autoPlay() {
      try {
        let viewHistory = await this.getAnimeViewHistory();
        // 后处理: 仅筛选 WebPlayer 的播放历史
        viewHistory.data.data = viewHistory.data.data?.filter(
          (record: any) => record.watchMethod == "WebPlayer"
        );

        // 如果没有历史记录, 直接以第一次打开
        if (viewHistory.data.data?.length == 0) {
          return this.firstThisAnime();
        }
        // 有历史记录, 选择最近一次的播放记录
        let lastRecord = viewHistory.data.data[0];
        // 在当前的文件列表找出上次的视频
        if (!this.fileData.fileList)
          throw new Error("File list not initialized");
        let findThisFile = this.fileData.fileList.find((file) => {
          return file?.name == lastRecord.fileName;
        });

        // 选择要播放的相同文件 / 集数
        if (findThisFile) {
          console.log("匹配到和上次播放完全相同的文件", findThisFile);
          try {
            if (findThisFile?.url) {
              await this.changeVideo(findThisFile.url);
            }
            this.seekByHistory(lastRecord);
          } catch (error) {
            console.error("切换视频时失败", error);
          }
        } else {
          console.log("找不到文件, 同话数模式...", lastRecord?.episode);
          try {
            await this.changeEpisode(lastRecord?.episode);
            this.seekByHistory(lastRecord);
          } catch (error) {
            console.error("切换集数时失败", error);
            if (error == "episodeNotFound") {
              // 之前的集数已经不再存在
              return this.firstThisAnime();
            }
          }
        }
      } catch (error) {
        console.error(error);
        // 获取播放历史失败 ��用默认打开界面的情况
        this.firstThisAnime();
      }
    },
    /**
     * (用于其他 actions 调用) 自动播放第一个集数/视频
     */
    firstThisAnime() {
      // 如果能识别到集数列表, 自动选择第一个集数播放
      if (this.episodeList.length) {
        this.changeEpisode(this.episodeList[0].episode);
      }
      // 没有集数列表, 播放第一个视频
      else if (this.fileData.fileList.length) {
        this.changeVideo(
          // 找文件列表中第一个是视频的文件
          this.fileData.fileList.find((file) => {
            return (
              file?.type == "file" &&
              file?.parseResult?.extensionName?.type == "video"
            );
          })?.url ?? ""
        );
      }
    },
    /**
     * 传入历史记录, 跳转进度条并显示用户提示
     * @param {Object | undefined} history
     */
    async seekByHistory(history: {
      currentTime?: number;
      episode?: string;
      totalTime?: number;
    }) {
      if (!history.currentTime) return;
      if (
        !history.totalTime ||
        !history.currentTime ||
        history.totalTime - history.currentTime < 20
      ) {
        window.$message.success("本话上次已看完");
        return;
      }

      if (!this.artInstance?.video)
        throw new Error("Artplayer video element not initialized");
      this.artInstance.video.currentTime = history.currentTime;
      const ep = history?.episode ? `第 ${history.episode} 话` : "";
      const m = Math.floor(history?.currentTime / 60)
        .toString()
        .padStart(2, "0");
      const s = (history?.currentTime % 60).toString().padStart(2, "0");
      window.$message.info(`上次${ep}播放到 ${m}:${s}, 已自动跳转`, {
        duration: 5000,
      });
    },
    /**
     * 切换集数, 同时自动跳转某集数的历史进度
     * 此 API 会阻止相同集数切换
     * @param {String} episode
     * @returns
     */
    async changeEpisodeAutoHistory(episode: string) {
      if (episode === this.fileData.activeEpisode) return;
      // Promise.allSettled() 等待所有 Promise 都完成，无论是否出错
      let result = await Promise.allSettled([
        this.getAnimeViewHistory(),
        this.changeEpisode(episode),
      ]);
      // 如果切换集数出现错误, throw 至上层处理
      if (result[1].status == "rejected") {
        throw result[1].reason;
      }
      // 等待视频切换和获取播放历史都成功后, 尝试跳转进度条
      if (result[0].status !== "rejected") {
        let viewHistory = result[0].value;
        if (viewHistory.data.data.length) {
          this.seekByHistory(
            viewHistory.data.data.find(
              (record: {
                episode?: string;
                watchMethod?: string;
                currentTime?: number;
                totalTime?: number;
              }) => {
                return record.episode == episode;
              }
            )
          );
        }
      }
    },
    /**
     * 自动选择最合适的中文字幕
     * 本方法应该在字幕列表产生后调用
     * 优先级：sc > tc > chs > cht > chi > zho > 首个字幕
     * 使用更灵活的正则匹配规则，支持多种常见字幕命名方式
     */
    async autoSubtitle() {
      const subtitles = this.subtitleList;
      console.log(
        "可用的字幕列表",
        subtitles.map((sub) => sub.name)
      );

      // 定义字幕匹配优先级配置（支持多种常见命名方式）
      const priorityConfig = [
        {
          // 匹配 sc, sc-hs, sc_simp 等
          pattern: /(?:^|[._-])sc(?:h(?:i|s|_simp)?)?(?:[._-]|$)/i,
          log: "简体中文",
        },
        {
          // 明确匹配 chs
          pattern: /(?:^|[._-])chs(?:[._-]|$)/i,
          log: "简体中文",
        },
        {
          // 匹配 tc, tc-ht, tc_trad 等
          pattern: /(?:^|[._-])tc(?:h(?:t|_trad)?)?(?:[._-]|$)/i,
          log: "繁体中文",
        },
        {
          // 明确匹配 cht
          pattern: /(?:^|[._-])cht(?:[._-]|$)/i,
          log: "繁体中文",
        },
        {
          // 匹配 chi, chinese, chi_sub
          pattern: /(?:^|[._-])chi(?:n(?:ese|_sub))?(?:[._-]|$)/i,
          log: "中文",
        },
        {
          // 匹配 zho
          pattern: /(?:^|[._-])zho(?:[._-]|$)/i,
          log: "中文",
        },
      ];

      // 按优先级查找第一个匹配的字幕
      const matchedConfig = priorityConfig.find(({ pattern }) =>
        subtitles.some((sub) => pattern.test(sub.name))
      );

      if (matchedConfig) {
        // 获取第一个匹配的字幕文件（通过some已确保存在）
        const targetSub = subtitles.find((sub) =>
          matchedConfig.pattern.test(sub.name)
        )!;
        this.subtitleData.subtitleFileName = targetSub.name;
        console.log(`自动选择${matchedConfig.log}字幕: ${targetSub.name}`);
        return;
      }

      // 默认选择第一个字幕（如果有）
      if (subtitles.length > 0) {
        this.subtitleData.subtitleFileName = subtitles[0].name;
        console.log("自动选择首个字幕:", subtitles[0].name);
        return;
      }

      // 无可用字幕
      this.subtitleData.subtitleFileName = null;
      console.log("未找到匹配的字幕文件");
    },
  },
});
