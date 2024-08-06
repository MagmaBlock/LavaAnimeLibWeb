import nodePath from "path/posix";
import type { StorageReader } from "../stroage/reader/interface";
import type { LibFile } from "@prisma/client";

/**
 * 读取数据库中 LibFile 的类
 * 本类中的方法均是对数据库的读方法
 */
export class LibraryIndexReader {
  libraryTool: StorageReader;

  constructor(libraryTool: StorageReader) {
    this.libraryTool = libraryTool;
  }

  /**
   * 使用绝对路径获取某个文件/文件夹的信息
   * @param path 绝对路径
   * @returns
   */
  async getFile(path: string): Promise<LibFile | null> {
    const parsePath = nodePath.parse(path);

    return await usePrisma.libFile.findUnique({
      where: {
        uniqueFileInLib: {
          libraryId: this.libraryTool.library.id,
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

    return await usePrisma.libFile.findMany({
      where: {
        libraryId: this.libraryTool.library.id,
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

    return await usePrisma.libFile.findMany({
      where: {
        libraryId: this.libraryTool.library.id,
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

    return await usePrisma.libFile.findMany({
      where: {
        libraryId: this.libraryTool.library.id,
        removed: false,
        path,
        animeId: null,
      },
    });
  }
}
