/*
  Warnings:

  - You are about to drop the `userinfomation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[avatarForId]` on the table `StorageIndex` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarFileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `userinfomation` DROP FOREIGN KEY `UserInfomation_ownerId_fkey`;

-- AlterTable
ALTER TABLE `storageindex` ADD COLUMN `avatarForId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatarFileId` INTEGER NULL,
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    MODIFY `settings` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `userinfomation`;

-- CreateIndex
CREATE UNIQUE INDEX `StorageIndex_avatarForId_key` ON `StorageIndex`(`avatarForId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_avatarFileId_key` ON `User`(`avatarFileId`);

-- AddForeignKey
ALTER TABLE `StorageIndex` ADD CONSTRAINT `StorageIndex_avatarForId_fkey` FOREIGN KEY (`avatarForId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
