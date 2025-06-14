import { PrismaClient } from "@prisma/client";
import { AlistStorageSystem } from "../../../services/storage/system/alist";

const prisma = new PrismaClient();
const storage = await prisma.storage.findFirst({
  where: { id: "3A_Xinxiang" },
});
if (!storage) {
  throw new Error("未找到存储库");
}
const storageSystem = new AlistStorageSystem(storage);

console.log(
  await storageSystem.getDownloadUrl(
    "/2024年/7月夏/【我推的孩子】 第二季 443428/[Sakurato] Oshi no Ko (2024) [12][AVC-8bit 1080p AAC][CHS&JPN].mp4",
  ),
  await storageSystem.getDownloadUrl(
    "/2024年/7月夏/【我推的孩子】 第二季 443428/[Sakurato] Oshi no Ko (2024) [13][AVC-8bit 1080p AAC][CHS&JPN].mp4",
  ),
  await storageSystem.getDownloadUrl(
    "/2024年/7月夏/【我推的孩子】 第二季 443428/[Sakurato] Oshi no Ko (2024) [14][AVC-8bit 1080p AAC][CHS&JPN].mp4",
  ),
);

// console.log(await storageSystem.list("/2024年/1月冬/龙与魔女 #0.8 454887"));
// console.log(await storageSystem.list("/2024年/1月冬"));
// console.log(await storageSystem.info("/2024年"));

// await storageSystem.remove("/test2");
// await storageSystem.remove("/test");
// await storageSystem.mkdir("/test");
// await storageSystem.mkdir("/test2");
// await storageSystem.copy("/test", "/2024年");
// await storageSystem.move("/test2", "/2024年");
// await storageSystem.remove("/test");
// await storageSystem.remove("/test2");
