/*
  Warnings:

  - You are about to drop the column `posterForId` on the `animepicture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `animepicture` DROP FOREIGN KEY `AnimePicture_posterForId_fkey`;

-- AlterTable
ALTER TABLE `animepicture` DROP COLUMN `posterForId`,
    ADD COLUMN `animeId` INTEGER NULL,
    ADD COLUMN `type` ENUM('Poster', 'SmallPoster', 'Preview', 'Other') NULL;

-- AddForeignKey
ALTER TABLE `AnimePicture` ADD CONSTRAINT `AnimePicture_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
