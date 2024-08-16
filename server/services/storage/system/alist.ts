import type { FileType, Storage, StorageIndex } from "@prisma/client";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { posix as pathPosix } from "path";
import type {
  AlistApiResponse,
  AlistGetResponse,
  AlistListResponse,
  AlistMoveOrCopyRequest,
  AlistRemoveRequest,
  AlistStorageConfig,
} from "~/server/types/library/storage/reader/alist";
import { extensionMap } from "../file/type/type";
import type { StorageSystem } from "./interface";

/**
 * Alist 操作器实现
 */
export class AlistStorageSystem implements StorageSystem {
  storage: Storage;
  private alistToken: string;
  private alistTokenExpiresAt: Date; // 48h after get
  private config: AlistStorageConfig;

  constructor(storage: Storage) {
    if (storage.type !== "Alist") {
      throw new Error(
        "AlistStorageSystem 使用的 Storage 对象 type 应该是 Alist"
      );
    }
    this.storage = storage;
    this.alistToken = "";
    this.alistTokenExpiresAt = new Date(0);
    this.config = this.getConfig();
    this.refreshToken();
  }

  private getConfig(): AlistStorageConfig {
    if (this.storage.config === null) throw new Error("存储器配置有误");
    let config = <AlistStorageConfig>JSON.parse(this.storage.config);

    if (
      typeof config?.host !== "string" ||
      typeof config?.password !== "string" ||
      typeof config?.baseDir !== "string"
    ) {
      throw new Error("存储器配置有误");
    }

    return config;
  }

  private async refreshToken(): Promise<void> {
    if (this.alistTokenExpiresAt > new Date()) return;

    try {
      const response = await axios.post<AlistApiResponse<{ token: string }>>(
        "/api/auth/login",
        {
          username: this.config.username,
          password: this.config.password,
        },
        {
          baseURL: this.config.host,
        }
      );

      if (response.data.code !== 200) {
        throw new Error(`刷新 token 失败: ${response.data.message}`);
      }

      this.alistToken = response.data.data.token;
      this.alistTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async makeRequest<T>(
    url: string,
    config: AxiosRequestConfig
  ): Promise<T> {
    await this.refreshToken();
    try {
      const response = await axios<AlistApiResponse<T>>({
        ...config,
        url,
        baseURL: this.config.host,
        headers: {
          ...config.headers,
          Authorization: this.alistToken,
        },
      });

      if (response.data.code !== 200) {
        throw new Error(`Alist 请求失败: ${response.data.message}`);
      }

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      throw new Error(`Alist 请求失败: ${error.message}`);
    }
    throw error;
  }

  private getFullPath(path: string): string {
    return pathPosix.join(this.config.baseDir, path);
  }

  async copy(path: string, targetFolder: string): Promise<void> {
    const request: AlistMoveOrCopyRequest = {
      src_dir: pathPosix.dirname(this.getFullPath(path)),
      dst_dir: this.getFullPath(targetFolder),
      names: [pathPosix.basename(this.getFullPath(path))],
    };

    await this.makeRequest("/api/fs/copy", { method: "POST", data: request });
  }

  async move(path: string, targetFolder: string): Promise<void> {
    const request: AlistMoveOrCopyRequest = {
      src_dir: pathPosix.dirname(this.getFullPath(path)),
      dst_dir: this.getFullPath(targetFolder),
      names: [pathPosix.basename(this.getFullPath(path))],
    };

    await this.makeRequest("/api/fs/move", { method: "POST", data: request });
  }

  async list(path: string): Promise<Partial<StorageIndex>[]> {
    const response = await this.makeRequest<AlistListResponse>("/api/fs/list", {
      method: "POST",
      data: { path: this.getFullPath(path) },
    });

    return response.content.map((item) => ({
      name: item.name,
      type: this.getFileType(item.name),
      path: pathPosix.normalize(path),
      isDirectory: item.is_dir,
      size: item.size,
    }));
  }

  async info(path: string): Promise<Partial<StorageIndex>> {
    const item = await this.makeRequest<AlistGetResponse>("/api/fs/get", {
      method: "POST",
      data: { path: this.getFullPath(path) },
    });

    return {
      name: item.name,
      type: this.getFileType(item.name),
      path: pathPosix.dirname(pathPosix.normalize(path)),
      isDirectory: item.is_dir,
      size: item.size,
    };
  }

  async mkdir(path: string): Promise<void> {
    await this.makeRequest("/api/fs/mkdir", {
      method: "POST",
      data: { path: this.getFullPath(path) },
    });
  }

  async remove(path: string): Promise<void> {
    const request: AlistRemoveRequest = {
      names: [pathPosix.basename(path)],
      dir: pathPosix.dirname(this.getFullPath(path)),
    };

    await this.makeRequest("/api/fs/remove", { method: "POST", data: request });
  }

  async getDownloadUrl(path: string): Promise<string | null> {
    const info = await this.makeRequest<AlistGetResponse>("/api/fs/get", {
      method: "POST",
      data: { path: this.getFullPath(path) },
    });

    return info.raw_url || null;
  }

  private getFileType(fileName: string): FileType {
    const ext = pathPosix.parse(fileName).ext.slice(1);
    if (ext) {
      for (const [reg, extType] of extensionMap.entries()) {
        if (reg.test(ext)) {
          return extType[1];
        }
      }
    }
    return "Other";
  }

  // 未实现的方法
  readFile(path: string): Promise<Buffer | null> {
    throw new Error("Method not implemented.");
  }
  readFileStream(path: string): Promise<ReadableStream | null> {
    throw new Error("Method not implemented.");
  }
  readFileString(path: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  uploadFromBuffer(path: string, buffer: Buffer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getUploadUrl(path: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  // /**
  //  * 从 Alist 刷新最新的文件记录到数据库, 并返回最新的 LibFile 列表
  //  * @param path
  //  * @returns
  //  */
  // async updateIndex(path: string): Promise<LibFile[]> {
  //   let alistFiles: AlistAPIFile[] = [];
  //   let inDBLibFiles: LibFile[] = [];

  //   /**
  //    * 以下块：从 Alist 获取最新的文件列表，存入 alistFiles
  //    * 若失败将掷出错误
  //    */
  //   try {
  //     const listGet = await axios.post(
  //       "/api/fs/list",
  //       {
  //         path: pathPosix.join(this.getConfig().baseDir, path),
  //         password: this.getConfig().password,
  //       },
  //       {
  //         baseURL: this.getConfig().host,
  //       }
  //     );

  //     // 成功且有文件
  //     if (
  //       listGet.data?.code === 200 &&
  //       Array.isArray(listGet.data.data?.content)
  //     ) {
  //       alistFiles = listGet.data.data?.content;
  //     }

  //     // 成功但为空
  //     if (listGet.data?.code === 200 && listGet.data.data?.content === null) {
  //       alistFiles = [];
  //     }

  //     // 找不到文件夹
  //     if (
  //       listGet.data?.code === 500 &&
  //       listGet.data?.message.match("not found")
  //     ) {
  //       throw new NotFoundError(listGet.data.message);
  //     }

  //     // 其他意外情况
  //     if (!Array.isArray(alistFiles)) {
  //       App.instance.logger.error("Alist 返回意外结果:", listGet.data);
  //       throw new ServiceUnavailableError("Alist 服务异常");
  //     }
  //   } catch (error) {
  //     // Alist 在找不到路径时，不会回复 4xx，而是 200 中的 body 中的 code = 500
  //     if (error instanceof AxiosError) {
  //       App.instance.logger.error("Alist 请求失败:", error.message);
  //     }
  //     throw error;
  //   }

  //   /**
  //    * 以下块：遍历 alistFiles，将其插入或更新到数据库
  //    */
  //   try {
  //     // 首先遍历 Alist 的资源，将获取到的文件写入到数据库
  //     for (let index in alistFiles) {
  //       let alistFile = alistFiles[index];

  //       await App.instance.prisma.libFile.upsert({
  //         where: {
  //           uniqueFileInLib: {
  //             name: alistFile.name,
  //             path,
  //             libraryId: this.storage.id,
  //           },
  //         },
  //         update: {
  //           type: alistFile.is_dir ? "Other" : this.getFileType(alistFile.name),
  //           isDirectory: alistFile.is_dir,
  //           size: alistFile.size, // 只为文件标记尺寸
  //           removed: false,
  //           lastFoundAt: new Date(),
  //         },
  //         create: {
  //           type: alistFile.is_dir ? "Other" : this.getFileType(alistFile.name),
  //           libraryId: this.storage.id,
  //           path, // 数据库内存储的应是不含存储库前缀的路径
  //           name: alistFile.name,
  //           isDirectory: alistFile.is_dir,
  //           size: alistFile.size, // 只为文件标记尺寸
  //           removed: false,
  //           lastFoundAt: new Date(),
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     throw error;
  //   }

  //   /**
  //    * 以下块：将基于 Alist 更新后的数据库记录和 Alist 中的进行对比
  //    * 若此 path 下的文件(夹)不存在，则会将文件标记为 "removed"
  //    *
  //    * P.S. 这里只能删除到调用此函数时传入的 path 的子文件、子文件夹
  //    *      若数据库中包含有上级目录已经被删除的文件(夹)，则不是在这里删除的。
  //    *      (是在 LibraryScanner.scan() 完成的)
  //    */
  //   try {
  //     inDBLibFiles = await App.instance.prisma.libFile.findMany({
  //       where: {
  //         libraryId: this.storage.id,
  //         path,
  //         removed: false,
  //       },
  //     });

  //     // 遍历数据库中当前库路径中所有未删除的文件
  //     for (const dbFile of inDBLibFiles) {
  //       // 在 Alist 中查找此文件
  //       const thisFileInAlist = alistFiles.find(
  //         (alistFile) => alistFile.name === dbFile.name
  //       );

  //       // 如果此 DB 的文件在 Alist 中不存在，将文件标记为 "removed"
  //       if (thisFileInAlist === undefined) {
  //         await App.instance.prisma.libFile.update({
  //           where: {
  //             uniqueFileInLib: {
  //               libraryId: dbFile.libraryId,
  //               path: dbFile.path,
  //               name: dbFile.name,
  //             },
  //           },
  //           data: {
  //             removed: true,
  //           },
  //         });
  //         App.instance.logger.trace(
  //           `${this.storage.name}(${this.storage.id}) 删除 ${dbFile.path}${dbFile.name}`
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }

  //   const result = await App.instance.prisma.libFile.findMany({
  //     where: {
  //       libraryId: this.storage.id,
  //       path,
  //       removed: false,
  //     },
  //   });

  //   return result;
  // }
}
