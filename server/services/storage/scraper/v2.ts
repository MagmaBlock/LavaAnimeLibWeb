import type { Anime, Storage, StorageIndex } from "@prisma/client";
import nodePath from "path/posix";
import type { StorageScrapeResult } from "~/server/types/storage/scraper/result";
import { App } from "../../app";
import { StorageIndexManager } from "../index/manager";
import type { StorageScraper } from "./interface";

/**
 * LavaAnimeLibV2 是番剧库的上一代版本，在本版本中作为一种结构。
 * V2 中，对番剧目录的结构规范主要为以下方式：
 *
 * LavaAnimeLib -> 年代 -> 季度/类别 -> 番剧名 + 空格 + 可选标签 + Bangumi Subject ID
 *  - 年代包含"年"字，如 "2023年"
 *  - 季度/类别为日本动画的四个季度，附带季节名，如 "1月冬"，同时还有"SP、OVA、OAD等"、"三次元"、"其他地区"、"剧场版"、"网络动画"等分类
 *  - 番剧文件夹包含番剧名、方括号括住的标签 BDRip 和 NSFW、Bangumi Subject ID。中间使用空格隔开
 *
 * 示例：
 * LavaAnimeLib/
 * - 2023年/
 * -- 1月冬/
 * --- 别当欧尼酱了！ 378862
 * -- 4月春/
 * --- 某某某 [BDRip] 123456
 * -- 7月夏/
 * -- 10月秋/
 * -- SP、OVA、OAD等/
 * -- 三次元/
 * -- 其他地区/
 * -- 剧场版/
 * -- 网络动画/
 *
 * 此结构要求存储库根目录内第一层就是年份文件夹，也就是 LavaAnimeLib/ 是根目录。
 * 本结构中的番剧只支持关联到 Bangumi，在没有合法 bgmId 的情况下，将不会关联站点。
 */
export class LavaAnimeLibV2Scraper implements StorageScraper {
  public storage: Storage;
  private indexManager: StorageIndexManager;
  private bgmToAnimeCache: Map<string, [Date, Anime[]]>;

  constructor(storage: Storage) {
    this.storage = storage;
    this.indexManager = new StorageIndexManager(storage);
    this.bgmToAnimeCache = new Map();
  }

  /**
   * 对文件进行挂削，本方法将挂削提供的所有文件，并返回一个 LibraryScrapeResult
   * @param files
   * @returns
   */
  async scrapeFiles(files: StorageIndex[]): Promise<StorageScrapeResult[]> {
    const groupedFiles = this.groupFilesByAnime(files);
    const results: StorageScrapeResult[] = [];

    for (const [key, group] of groupedFiles) {
      const result = await this.scrapeFileGroup(group);
      if (Object.keys(result).length > 0) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * 本方法将文件按照动画分组。
   * 相同的 parseYearTypeAnime 将会被归为一组。
   * 本方法的诞生是由于本实现类设计时没有考虑好新番入库的情况，
   * 因此为了避免每份文件都产生一个创建 anime 的请求而生的
   */
  private groupFilesByAnime(
    files: StorageIndex[]
  ): Map<string, StorageIndex[]> {
    const groups = new Map<string, StorageIndex[]>();

    for (const file of files) {
      const parsed = this.parseYearTypeAnime(file);
      const key = JSON.stringify(parsed);

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(file);
    }

    return groups;
  }

  /**
   * 用于挂削一个番剧
   * @param files 必须是同番剧文件夹下的文件
   * @returns
   */
  private async scrapeFileGroup(
    files: StorageIndex[]
  ): Promise<StorageScrapeResult> {
    if (files.length === 0) return {};

    const parsed = this.parseYearTypeAnime(files[0]);

    if (parsed.year === null || parsed.type === null || parsed.title === null) {
      return {};
    }

    // 只挂削未绑定动画的文件
    const noAnimeFiles = files.filter((f) => f.animeId === null);
    if (noAnimeFiles.length === 0) return {};

    // 1: 能够识别出文件的 bgmID
    if (parsed.bgmID !== null) {
      const maybeAnime = await this.getAnimesSiteLinkedWithCache(parsed.bgmID);

      // A: 如果库内已有该番剧，直接关联此文件
      if (maybeAnime.length !== 0) {
        return {
          connectFiles: {
            animeId: maybeAnime[0].id,
            files: noAnimeFiles,
          },
        };
      }
      // B: 库内没有此番剧，创建
      else {
        return {
          createAnime: {
            name: parsed.title,
            bdrip: parsed.bdrip,
            nsfw: parsed.nsfw,
            releaseYear: parsed.year,
            releaseSeason: ["1月冬", "4月春", "7月夏", "10月秋"].includes(
              parsed.type
            )
              ? parsed.type
              : null,
            region: ["1月冬", "4月春", "7月夏", "10月秋"].includes(parsed.type)
              ? "Japan"
              : null,
          },
          connectSites: parsed.bgmID
            ? {
                sites: [
                  {
                    siteType: "Bangumi",
                    siteId: parsed.bgmID,
                  },
                ],
              }
            : undefined,
          connectFiles: {
            files: files,
          },
        };
      }
    }
    // 2: 非 bangumi 的番剧（找不到 bgmId 的）
    else {
      // A: 向父级寻找有绑定 anime 属性的文件
      const maybeAnime = await this.getAnimeBindByParentFolders(files[0]);
      if (maybeAnime) {
        return { connectFiles: { animeId: maybeAnime, files: files } };
      }
      // B: 创建新 Anime
      return {
        createAnime: {
          name: parsed.title,
          bdrip: parsed.bdrip,
          nsfw: parsed.nsfw,
          releaseYear: parsed.year,
          releaseSeason: ["1月冬", "4月春", "7月夏", "10月秋"].includes(
            parsed.type
          )
            ? parsed.type
            : null,
          region: ["1月冬", "4月春", "7月夏", "10月秋"].includes(parsed.type)
            ? "Japan"
            : null,
        },
        connectFiles: {
          files: files,
        },
      };
    }
  }

  /**
   * 传入文件 startsWith，将自动寻找路径下的所有文件，并调用 scrapeFiles 挂削
   *
   * @param pathStartsWith
   * @returns 挂削结果
   */
  async scrapeStartsWith(
    pathStartsWith: string
  ): Promise<StorageScrapeResult[]> {
    let files: StorageIndex[] = [];

    const childFiles = await this.indexManager.getChildFiles(pathStartsWith);

    files = files.concat(childFiles);

    const pathSplit = pathStartsWith.match(/^(.*)(\/)(.*)$/);
    if (pathSplit) {
      const [fullMatch, group1, group2, group3] = pathSplit;
      const pathFile = await App.instance.prisma.storageIndex.findFirst({
        where: {
          path: group1,
          name: group3,
        },
      });
      if (pathFile) {
        files.push(pathFile);
      }
    }

    return await this.scrapeFiles(files);
  }

  /**
   * 此方法将 LibFile 解析成可读的对象
   * @param file
   */
  private parseYearTypeAnime(file: StorageIndex): {
    year: number | null;
    type: string | null;
    title: string | null;
    bdrip: boolean;
    nsfw: boolean;
    bgmID: string | null;
  } {
    const pathParts = file.path.split("/").filter((part) => part !== "");
    const yearFolder = pathParts?.[0] ?? file.name;
    const typeFolder =
      pathParts?.[1] ?? (pathParts.length === 1 ? file.name : null);
    const animeFolder =
      pathParts?.[2] ?? (pathParts.length === 2 ? file.name : null);

    const yearMatch = yearFolder?.match(/^\d{4}年$/);
    const yearNumber = yearMatch ? Number(yearFolder.replace("年", "")) : null;

    const parsedAnimeFolder = animeFolder
      ? parseV2AnimeFolderName(animeFolder)
      : null;

    return {
      year: yearNumber,
      type: typeFolder,
      title: parsedAnimeFolder?.title ?? null,
      bdrip: parsedAnimeFolder?.bdrip ?? false,
      nsfw: parsedAnimeFolder?.nsfw ?? false,
      bgmID: parsedAnimeFolder?.bgmID ?? null,
    };

    /**
     * 根据 LavaAnimeLibV2 规范的文件夹名, 解析出标题、bgmID、是否为 BD、NSFW
     * 如果这个文件夹名不合规范，即找不到结尾的 BgmID，
     * 那么这个方法 bgmID 为 null，title 是文件夹名，bdrip 和 nsfw 按预期工作。
     */
    function parseV2AnimeFolderName(folderName: string): {
      bgmID: string | null;
      title: string;
      bdrip: boolean;
      nsfw: boolean;
    } {
      let bgmID: string | null = null;
      const maybeBgmID = folderName.match("\\d+$");
      if (maybeBgmID && Number(maybeBgmID[0]) > 0) {
        bgmID = maybeBgmID[0];
      }

      let title = bgmID ? folderName.replace(bgmID, "").trim() : folderName;

      // tag parse
      let bdrip = false;
      let nsfw = false;
      if (title.match(/\[BDRip\]/gi)) {
        title = title.replace(/\[BDRip\]/gi, "").trim();
        bdrip = true;
      }
      if (title.match(/\[NSFW\]/gi)) {
        title = title.replace(/\[NSFW\]/gi, "").trim();
        nsfw = true;
      }
      return { bgmID, title, bdrip, nsfw };
    }
  }

  /**
   * 获取目前已有的动画中，绑定了指定 Bangumi 的动画
   * @param bgmID
   */
  private async getAnimesSiteLinkedWithCache(bgmID: string): Promise<Anime[]> {
    const cache = this.bgmToAnimeCache.get(bgmID);
    if (cache) {
      const [cacheTime, animes] = cache;
      if (new Date().getTime() - cacheTime.getTime() < 1000 * 30) {
        return animes;
      }
    }

    const animes = await App.instance.prisma.anime.findMany({
      where: {
        sites: {
          some: { siteType: "Bangumi", siteId: bgmID },
        },
      },
    });

    this.bgmToAnimeCache.set(bgmID, [new Date(), animes]);
    return animes;
  }

  /**
   * 从文件的父文件夹中寻找绑定的 anime
   */
  private async getAnimeBindByParentFolders(
    file: StorageIndex
  ): Promise<number | null> {
    const parentFolders = await this.indexManager.getParentFolders(file.path);
    const nearestAnimeFolder = parentFolders.find(
      (folder) => folder.animeId !== null
    );
    return nearestAnimeFolder ? nearestAnimeFolder.animeId : null;
  }
}
