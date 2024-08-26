/*
  Warnings:

  - The primary key for the `animeviewhistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `libFileId` on the `animeviewhistory` table. All the data in the column will be lost.
  - You are about to drop the column `storageId` on the `animeviewhistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,animeId,fileId]` on the table `AnimeViewHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `AnimeViewHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `animeviewhistory` DROP FOREIGN KEY `AnimeViewHistory_libFileId_fkey`;

-- DropForeignKey
ALTER TABLE `animeviewhistory` DROP FOREIGN KEY `AnimeViewHistory_storageId_fkey`;

-- AlterTable
ALTER TABLE `animeviewhistory` DROP PRIMARY KEY,
    DROP COLUMN `libFileId`,
    DROP COLUMN `storageId`,
    ADD COLUMN `episodeId` INTEGER NULL,
    ADD COLUMN `fileId` INTEGER NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `AnimeViewHistory_userId_animeId_fileId_key` ON `AnimeViewHistory`(`userId`, `animeId`, `fileId`);

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_episodeId_fkey` FOREIGN KEY (`episodeId`) REFERENCES `AnimeEpisode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `StorageIndex`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
