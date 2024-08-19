import type { AnimePlatform } from "@prisma/client";
import { App } from "~/server/services/app";

export default defineEventHandler(async (event) => {
  const indexMap = await App.instance.prisma.anime.groupBy({
    by: ["releaseYear", "releaseSeason", "platform", "region"],
  });

  const releaseYears = Array.from(
    new Set(
      indexMap.map((item) => item.releaseYear).filter((year) => year !== null)
    )
  ).sort((a, b) => b - a);

  const releaseSeasons = Array.from(
    new Set(
      indexMap
        .map((item) => item.releaseSeason)
        .filter((season) => season !== null)
    )
  ).sort((a, b) => {
    const numA = parseInt(a.match(/^\d+/)?.[0] || "Infinity", 10);
    const numB = parseInt(b.match(/^\d+/)?.[0] || "Infinity", 10);
    return numA - numB;
  });

  const platforms = Array.from(
    new Set(
      indexMap
        .map((item) => item.platform)
        .filter((platform) => platform !== null)
    )
  ).sort((a, b) => {
    const order: AnimePlatform[] = ["TV", "Movie", "Web", "OVA", "Other"];
    const indexA = order.indexOf(a);
    const indexB = order.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const regions = Array.from(
    new Set(
      indexMap.map((item) => item.region).filter((region) => region !== null)
    )
  ).sort();

  return {
    releaseYears,
    releaseSeasons,
    platforms,
    regions,
  };
});
