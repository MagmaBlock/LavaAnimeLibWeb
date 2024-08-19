/*
  Warnings:

  - You are about to drop the column `animePictureId` on the `storageindex` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `AnimePicture` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `storageindex` DROP FOREIGN KEY `StorageIndex_animePictureId_fkey`;

-- AlterTable
ALTER TABLE `animepicture` ADD COLUMN `fileId` INTEGER NULL;

-- AlterTable
ALTER TABLE `storageindex` DROP COLUMN `animePictureId`;

-- CreateIndex
CREATE UNIQUE INDEX `AnimePicture_fileId_key` ON `AnimePicture`(`fileId`);

-- AddForeignKey
ALTER TABLE `AnimePicture` ADD CONSTRAINT `AnimePicture_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `StorageIndex`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
