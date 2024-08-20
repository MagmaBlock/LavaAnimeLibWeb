/*
  Warnings:

  - A unique constraint covering the columns `[type,animeId]` on the table `AnimePicture` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AnimePicture_type_animeId_key` ON `AnimePicture`(`type`, `animeId`);
