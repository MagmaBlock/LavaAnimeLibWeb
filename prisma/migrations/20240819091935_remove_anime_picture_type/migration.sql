/*
  Warnings:

  - You are about to drop the column `animeId` on the `animepicture` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `animepicture` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[posterForId]` on the table `AnimePicture` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `animepicture` DROP FOREIGN KEY `AnimePicture_animeId_fkey`;

-- AlterTable
ALTER TABLE `animepicture` DROP COLUMN `animeId`,
    DROP COLUMN `type`,
    ADD COLUMN `posterForId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AnimePicture_posterForId_key` ON `AnimePicture`(`posterForId`);

-- AddForeignKey
ALTER TABLE `AnimePicture` ADD CONSTRAINT `AnimePicture_posterForId_fkey` FOREIGN KEY (`posterForId`) REFERENCES `Anime`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
