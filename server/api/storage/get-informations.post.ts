import { App } from "~/server/services/app";
import { getUserFromEvent } from "~/server/utils/auth";
import type { Storage } from "@prisma/client";

const prisma = App.instance.prisma;

interface StorageInformation {
  id: string;
  name: string;
  description: string | null;
  type: string; // Prisma's StorageType enum will be compatible with string here
  noNSFW: boolean;
  noDownload: boolean;
  bindScraper: string | null; // Corrected type
}

export default defineEventHandler(async (event): Promise<{ success: boolean; message: string; data: StorageInformation[] | null }> => {
  const user = await getUserFromEvent(event);

  if (!user) {
    return {
      success: false,
      message: "用户未认证",
      data: null,
    };
  }

  try {
    const storages = await prisma.storage.findMany();
    const responseData: StorageInformation[] = storages.map((storage: Storage) => ({
      id: storage.id,
      name: storage.name,
      description: storage.description,
      type: storage.type,
      noNSFW: storage.noNSFW,
      noDownload: storage.noDownload,
      bindScraper: storage.bindScraper,
    }));

    return {
      success: true,
      message: "获取存储信息成功",
      data: responseData,
    };
  } catch (error) {
    console.error(`[API Error] /api/v1/storage/get-informations:`, error);
    return {
      success: false,
      message: "获取存储信息失败",
      data: null,
    };
  }
});