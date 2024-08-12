import { AnimeInfoSource, type LibFile, Region } from "@prisma/client";
import nodePath from "path/posix";
import type {
  LibraryScrapeResult,
  LibraryScrapeResultAnime,
} from "~/server/types/library/scraper/result";
import { App } from "../../app";
import { LibraryIndexReader } from "../index/reader";
import type { StorageReader } from "../stroage/reader/interface";
import type { LibraryScraper } from "./interface";

/**
 * LavaAnimeLibV2 是番剧库的上一代版本
 * V2 中，对番剧目录的结构规范主要为以下方式：
 *
 * LavaAnimeLib -> 年代 -> 季度/类别 -> 番剧名 + 空格 + Bangumi Subject ID
 *  - 年代包含"年"字，如 "2023年"
 *  - 季度/类别为日本动画的四个季度，附带季节名，如 "1月冬"，同时还有"SP、OVA、OAD等"、"三次元"、"其他地区"、"剧场版"、"网络动画"等分类
 *  - 番剧文件夹包含番剧名、Bangumi Subject ID、BDRip、NSFW，中间使用空格隔开
 *
 * 示例：
 * LavaAnimeLib/
 * - 2023年/
 * -- 1月冬/
 * --- 别当欧尼酱了！ 378862
 * -- 4月春/
 * -- 7月夏/
 * -- 10月秋/
 * -- SP、OVA、OAD等/
 * -- 三次元/
 * -- 其他地区/
 * -- 剧场版/
 * -- 网络动画/
 */
export class LavaAnimeLibV2LibraryScraper implements LibraryScraper {
  private storageReader: StorageReader;
  private indexReader: LibraryIndexReader;

  constructor(libraryTool: StorageReader) {
    this.storageReader = libraryTool;
    this.indexReader = libraryTool.getIndexReader();
  }

  /**
   * 挂削文件库。
   *
   * 本方法会自动触发向后代染色。（向后代关联 anime）
   * 然后寻找没有关联到 anime 的文件夹，然后尝试挂削。
   * @param pathStartsWith
   * @returns 挂削结果
   */
  async scrapeLibrary(pathStartsWith: string): Promise<LibraryScrapeResult[]> {
    // 结果存储
    const scrapeResult: LibraryScrapeResult[] = [];

    // 先对所有文件进行一个染色
    await this.markAnimeForBlankFiles("/");

    // 开始挂削流程
    const allYears = await this.readAllYears();
    App.instance.logger.debug("所有年份:", allYears);
    // 遍历所有年份
    for (let year of allYears) {
      const allTypes = await this.readTypesInYear(year);
      App.instance.logger.debug(`${year} 下读取到 ${allTypes.length} 个类型.`);
      // 遍历所有类型
      for (let type of allTypes) {
        const allAnimes = await this.readAnimesInType(year, type);
        if (allAnimes.length) {
          App.instance.logger.debug(
            `${year} ${type} 下读取到 ${allAnimes.length} 个新动漫.`
          );
        }
        // 遍历所有可能的动画
        for (let anime of allAnimes) {
          const parseResult = await this.parseAnimes(year, type, anime);
          if (parseResult) scrapeResult.push(parseResult);
        }
      }
    }
    return scrapeResult;
  }

  /**
   * 读取所有年份
   * 只会返回没有关联到 anime 的文件夹
   * @returns 纯数字年份
   */
  private async readAllYears(): Promise<number[]> {
    const root = await this.indexReader.getFirstSubFilesWithNoAnime("/");
    const allYears: number[] = [];
    root.forEach((record) => {
      if (record.isDirectory) {
        // 只读取"xxxx年"的年份
        if (record.name.match(/^\d{4}年$/g)) {
          allYears.push(Number(record.name.replace("年", "")));
        }
      }
    });
    return allYears;
  }

  /**
   * 获取年份下的分类
   * 只会返回没有关联到 anime 的文件夹
   */
  private async readTypesInYear(year: number): Promise<string[]> {
    const yearPath = `/${year}年`;
    const yearRoot = await this.indexReader.getFirstSubFilesWithNoAnime(
      yearPath
    );
    const allTypes: string[] = [];
    yearRoot.forEach((record) => {
      if (record.isDirectory) {
        allTypes.push(record.name);
      }
    });

    return allTypes;
  }

  /**
   * 获取所有的动画文件夹名
   * 只会返回没有关联到 anime 的文件夹
   */
  private async readAnimesInType(
    year: number,
    type: string
  ): Promise<string[]> {
    const typePath = `/${year}年/${type}`;
    const typeRoot = await this.indexReader.getFirstSubFilesWithNoAnime(
      typePath
    );
    const allAnimes: string[] = [];
    typeRoot.forEach((record) => {
      if (record.isDirectory) {
        allAnimes.push(record.name);
      }
    });
    return allAnimes;
  }

  /**
   * 根据 LavaAnimeLibV2 规范的文件夹名, 解析出标题、bgmID、是否为 BD、NSFW
   * 如果这个文件夹名不合规范，即找不到结尾的 BgmID，
   * 那么这个方法 bgmID 为 null，title 是文件夹名，bdrip 和 nsfw 按预期工作。
   */
  private parseV2AnimeFolderName(folderName: string): {
    bgmID: string | null;
    title: string;
    bdrip: boolean;
    nsfw: boolean;
  } {
    let bgmID: string | null = null;
    const maybeBgmID = folderName.match("\\d+$");
    if (maybeBgmID) {
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

  /**
   * 传入每个类型下的动画类型，尝试挂削动画
   * @param year 年份
   * @param type 类型
   * @param anime 动画文件夹名
   * @returns LibraryScrapeResult 时是成功找到并挂削新番剧。null 时是父文件夹不存在或文件夹已经有番剧归属。
   */
  private async parseAnimes(
    year: number,
    type: string,
    anime: string
  ): Promise<LibraryScrapeResult | null> {
    // 解析动画文件夹的名称
    const parseFolder = this.parseV2AnimeFolderName(anime);
    // 路径前缀，在此文件夹中的后代文件都视为此动画的文件
    const pathStartsWith = `/${year}年/${type}/${anime}`;

    // 创建新的 LibraryScrapeResultAnime 对象
    const scrapeResultAnime: LibraryScrapeResultAnime = await (async () => {
      // 如果有 BgmID，则尝试寻找库内已有的相同 Bangumi ID 的动画
      if (parseFolder.bgmID !== null) {
        const sameBangumiAnimes = await App.instance.prisma.anime.findFirst({
          where: {
            sites: {
              every: {
                siteType: "Bangumi",
                siteId: parseFolder.bgmID,
              },
            },
          },
          include: {
            sites: true,
          },
        });

        if (sameBangumiAnimes) {
          return {
            id: sameBangumiAnimes.id,
            name: sameBangumiAnimes.name,
            sites: sameBangumiAnimes.sites,
          };
        }
      }

      // 如果库内没有一致的 Bangumi Site Anime，则创建新的 LibraryScrapeResultAnime 对象
      return {
        name: parseFolder.title,
        bdrip: parseFolder.bdrip,
        nsfw: parseFolder.nsfw,
        releaseYear: year,
        releaseSeason: (() => {
          if (["1月冬", "4月春", "7月夏", "10月秋"].includes(type)) {
            return type;
          }
        })(),
        region: (() => {
          // 默认将季度动画的动画地区设置为日本
          if (["1月冬", "4月春", "7月夏", "10月秋"].includes(type)) {
            return Region.Japan;
          }
        })(),
        sites: (() => {
          // 如果此动画有 BGM ID，则将其添加到 sites 中
          if (parseFolder.bgmID !== null) {
            return [
              {
                siteType: AnimeInfoSource.Bangumi,
                siteId: parseFolder.bgmID,
              },
            ];
          } else {
            return [];
          }
        })(),
      };
    })();

    const parentFolder = await this.indexReader.getFile(pathStartsWith);
    if (!parentFolder || parentFolder.animeId !== null) {
      return null;
    }
    const allChilds = await this.indexReader.getAllSubFiles(pathStartsWith);

    return {
      anime: scrapeResultAnime,
      files: [
        parentFolder, // 父文件夹
        ...allChilds, // 此文件夹下的所有文件
      ],
    };
  }

  /**
   * 将当前库中没有归属的文件向父级目录寻找 anime 归属标记
   * 即向后代染色
   * @param path
   */
  private async markAnimeForBlankFiles(path: string): Promise<void> {
    const allBlank = await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        animeId: null,
        removed: false,
        path: { startsWith: path },
      },
    });

    App.instance.logger.trace(
      `${path} 下找到了 ${allBlank.length} 个无归属文件(夹), 尝试寻找归属...`
    );

    const cache = new Map<string, LibFile>();

    // 寻找父文件夹中存在的标记并更新标记
    const findFatherOrGrandpa = async (file: LibFile) => {
      // 获取父文件夹的信息
      const parent =
        cache.get(file.path) || (await this.indexReader.getFile(file.path));
      // 处在根目录中的文件无法向上查找
      if (parent === null) return null;
      if (parent.animeId) {
        // 存入缓存并返回
        cache.set(file.path, parent);
        return parent.animeId;
      } else {
        return await findFatherOrGrandpa(parent);
      }
    };

    for (const file of allBlank) {
      const parentAnimeId = await findFatherOrGrandpa(file);
      if (parentAnimeId) {
        App.instance.logger.debug(
          `${nodePath.join(file.path, file.name)} 找到了归属: ${parentAnimeId}`
        );
        await App.instance.prisma.libFile.update({
          where: {
            id: file.id,
          },
          data: {
            animeId: parentAnimeId,
          },
        });
      } else {
        // App.instance.logger.trace(`${nodePath.join(file.path, file.name)} 未找到归属.`);
      }
    }
  }

  getStorageReader(): StorageReader {
    return this.storageReader;
  }
}
