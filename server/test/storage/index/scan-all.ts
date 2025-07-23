import { prisma } from "~/server/src/context/prisma";
import { App } from "../../../services/app";
import { StorageIndexManager } from "../../../services/storage/index/manager";

const app = new App();
const storages = await prisma.storage.findMany();

for (const storage of storages) {
  const indexManager = new StorageIndexManager(storage);
  await indexManager.scan("/");
}
