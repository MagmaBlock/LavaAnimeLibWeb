import type { LibFile } from "@prisma/client";
import nodePath from "path/posix";
import { App } from "../../app";
import type { StorageReader } from "../stroage/reader/interface";

/**
 * 读取数据库中 LibFile 的类
 * 本类中的方法均是对数据库的读方法
 */
export class LibraryIndexReader {
  private storageReader: StorageReader;

  constructor(libraryTool: StorageReader) {
    this.storageReader = libraryTool;
  }

  /**
   * 使用绝对路径获取某个文件/文件夹的信息
   * @param path 绝对路径
   * @returns
   */
  async getFile(path: string): Promise<LibFile | null> {
    const parsePath = nodePath.parse(path);

    return await App.instance.prisma.libFile.findUnique({
      where: {
        uniqueFileInLib: {
          libraryId: this.storageReader.library.id,
          path: parsePath.dir,
          name: parsePath.base,
        },
        removed: false,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹
   */
  async getFirstSubFiles(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path,
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的所有子文件/文件夹
   * @param path
   */
  async getAllSubFiles(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path: { startsWith: path },
      },
    });
  }

  /**
   * 使用绝对路径获取某个文件夹的一层子文件/文件夹(但仅限没有 anime 归属的)
   */
  async getFirstSubFilesWithNoAnime(path: string): Promise<LibFile[]> {
    path = nodePath.join(path);

    return await App.instance.prisma.libFile.findMany({
      where: {
        libraryId: this.storageReader.library.id,
        removed: false,
        path,
        animeId: null,
      },
    });
  }

  getStorageReader(): StorageReader {
    return this.storageReader;
  }
}
