/*
  Warnings:

  - A unique constraint covering the columns `[userId,animeId,fileName]` on the table `AnimeViewHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `AnimeViewHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `animeviewhistory` DROP FOREIGN KEY `AnimeViewHistory_fileId_fkey`;

-- DropIndex
DROP INDEX `AnimeViewHistory_userId_animeId_fileId_key` ON `animeviewhistory`;

-- AlterTable
ALTER TABLE `animeviewhistory` ADD COLUMN `fileName` VARCHAR(191) NOT NULL,
    MODIFY `fileId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AnimeViewHistory_userId_animeId_fileName_key` ON `AnimeViewHistory`(`userId`, `animeId`, `fileName`);

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `StorageIndex`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
