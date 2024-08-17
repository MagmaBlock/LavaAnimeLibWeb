import { App } from "../services/app";
import { StorageIndexManager } from "../services/storage/index/manager";

const app = new App();
const prisma = app.prisma;
const storage = await prisma.storage.findFirst({
  where: { id: "3A_Xinxiang" },
});
if (!storage) {
  throw new Error("未找到存储库");
}

const indexManager = new StorageIndexManager(storage);
// await indexManager.scan("/");
// console.log(await indexManager.getDirContents("/2024年/7月夏"));
