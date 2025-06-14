import { App } from "~/server/services/app";
import { StorageService } from "~/server/services/storage/service";

const app = new App();

const storageService = app.services.getService(StorageService);
const storages = await storageService.getAllStorage();
const indexManager = storageService.getIndexManager(storages[1]);
// const file = await indexManager.getFileInfo("/2024年");
const parent = await indexManager.getParentFolders(
  "/2010年/10月秋/吊带袜天使 [BDRip] 8402/[Moozzi2&SGS&LavaAnimeLib] Panty & Stocking with Garterbelt [12][CHS][BDRip 1080P AVC AAC].mp4",
);

console.log(parent);
