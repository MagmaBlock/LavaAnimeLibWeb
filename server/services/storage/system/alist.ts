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
} from "~/server/types/storage/storage/reader/alist";
import { extensionMap } from "../../../types/anime/episode/type";
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

    if (response.content === null) return [];

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
}
