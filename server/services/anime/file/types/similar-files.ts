import { StorageIndex } from "@prisma/client";

export type SimilarFiles = {
  // uniqueId 由 animeId、fileName、size 计算而来
  uniqueId: string;

  animeId: number | null;
  fileName: string;
  size: number | null;
  // 文件的 StorageIndex 列表
  files: StorageIndex[];
};
