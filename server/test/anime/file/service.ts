import { App } from "~/server/services/app";
import { AnimeFileService } from "~/server/services/anime/file/service";

const app = new App();
const prisma = app.prisma;
const animeFileService = app.services.getService(AnimeFileService);

async function testAnimeFileService() {
  try {
    // 测试 getGroupedAnimeEpisodeFiles 方法
    console.log("测试 getGroupedAnimeEpisodeFiles 方法:");
    const episodeId = 1; // 假设存在的 AnimeEpisode ID
    const groupedEpisodeFiles =
      await animeFileService.getAnimeEpisodeFiles(episodeId);
    console.log("分组后的剧集文件:", groupedEpisodeFiles);

    // 测试 getGroupedAnimeFiles 方法
    console.log("\n测试 getGroupedAnimeFiles 方法:");
    const animeId = 1; // 假设存在的 Anime ID
    const groupedAnimeFiles = await animeFileService.getAnimeFiles(animeId);
    console.log("分组后的动画文件:", groupedAnimeFiles);

    // 测试 groupSimilarFiles 方法
    console.log("\n测试 groupSimilarFiles 方法:");
    const testFiles = await prisma.storageIndex.findMany({ take: 5 });
    const groupedSimilarFiles =
      await animeFileService.groupSimilarFiles(testFiles);
    console.log("分组后的相似文件:", groupedSimilarFiles);
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnimeFileService();
