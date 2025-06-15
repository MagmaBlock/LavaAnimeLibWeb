import { defineEventHandler } from "h3";
import { AnimePlatform, Region } from "@prisma/client";
import { App } from "~/server/services/app";

export default defineEventHandler(async (event) => {
  try {
    const prisma = App.instance.prisma;

    const indexMap = await prisma.anime.groupBy({
      by: ["releaseYear", "releaseSeason", "platform", "region"],
      // Prisma groupBy can return null for grouped fields if no records exist for that group or if the field itself is nullable
      // and all records in a group have null for that field.
      // However, the subsequent .filter(item => item !== null) handles this.
    });

    const releaseYears = Array.from(
      new Set(
        indexMap
          .map((item) => item.releaseYear)
          .filter((year): year is number => year !== null), // Type guard
      ),
    ).sort((a, b) => b - a);

    const releaseSeasons = Array.from(
      new Set(
        indexMap
          .map((item) => item.releaseSeason)
          .filter((season): season is string => season !== null), // Type guard
      ),
    ).sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || "Infinity", 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] || "Infinity", 10);
      return numA - numB;
    });

    const platforms = Array.from(
      new Set(
        indexMap
          .map((item) => item.platform)
          .filter((platform): platform is AnimePlatform => platform !== null), // Type guard
      ),
    ).sort((a, b) => {
      const order: AnimePlatform[] = ["TV", "Movie", "Web", "OVA", "Other"];
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Assuming region is also a string or string-like enum from Prisma
    const regions = Array.from(
      new Set(
        indexMap
          .map((item) => item.region)
          .filter((region): region is Region => region !== null), // Type guard for Region enum
      ),
    ).sort();

    return {
      success: true,
      message: "成功获取筛选条件",
      data: {
        releaseYears,
        releaseSeasons,
        platforms,
        regions,
      },
    };
  } catch (error: any) {
    console.error("[API Error][get-filters]:", error);
    // Consider logging the error to a more persistent store in production
    return {
      success: false,
      message: error.message || "获取筛选条件失败，请稍后再试。",
      data: null,
    };
  }
});