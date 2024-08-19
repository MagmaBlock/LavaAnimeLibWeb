-- CreateTable
CREATE TABLE `Anime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `summary` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bdrip` BOOLEAN NOT NULL DEFAULT false,
    `nsfw` BOOLEAN NOT NULL DEFAULT false,
    `platform` ENUM('TV', 'Web', 'OVA', 'Movie', 'Other') NULL,
    `date` DATETIME(3) NULL,
    `releaseYear` INTEGER NULL,
    `releaseSeason` VARCHAR(191) NULL,
    `region` ENUM('Japan', 'China', 'Korea', 'Europe', 'America', 'Other') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `count` INTEGER NULL,
    `source` ENUM('Bangumi', 'User') NOT NULL DEFAULT 'Bangumi',
    `lastFoundAt` DATETIME(3) NULL,
    `animeId` INTEGER NOT NULL,

    UNIQUE INDEX `AnimeTag_name_source_animeId_key`(`name`, `source`, `animeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeSiteLink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siteType` ENUM('Bangumi', 'User') NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NULL,
    `animeId` INTEGER NOT NULL,

    UNIQUE INDEX `AnimeSiteLink_siteType_siteId_animeId_key`(`siteType`, `siteId`, `animeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeRating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `score` DOUBLE NOT NULL,
    `rank` INTEGER NULL,
    `count` INTEGER NULL,
    `animeId` INTEGER NOT NULL,
    `source` ENUM('Bangumi', 'User') NOT NULL,

    UNIQUE INDEX `AnimeRating_animeId_source_key`(`animeId`, `source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeEpisode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodeDisplay` DOUBLE NOT NULL,
    `episodeIndex` DOUBLE NOT NULL DEFAULT 0,
    `type` ENUM('Normal', 'SP', 'OP', 'ED', 'Other') NOT NULL DEFAULT 'Other',
    `name` VARCHAR(191) NULL,
    `originalName` VARCHAR(191) NULL,
    `summary` TEXT NULL,
    `airDate` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `animeId` INTEGER NOT NULL,
    `source` ENUM('Bangumi', 'User') NOT NULL,

    UNIQUE INDEX `AnimeEpisode_animeId_type_episodeDisplay_key`(`animeId`, `type`, `episodeDisplay`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Storage` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('Alist', 'Local') NOT NULL,
    `config` VARCHAR(191) NULL,
    `noNSFW` BOOLEAN NOT NULL DEFAULT false,
    `noDownload` BOOLEAN NOT NULL DEFAULT false,
    `bindScraper` ENUM('LavaAnimeLibV2') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageIndex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('Video', 'Audio', 'Image', 'Document', 'Subtitle', 'Archive', 'Seed', 'Other') NOT NULL DEFAULT 'Other',
    `path` VARCHAR(512) NOT NULL,
    `isDirectory` BOOLEAN NOT NULL DEFAULT false,
    `size` DOUBLE NULL,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `lastFoundAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `storageId` VARCHAR(32) NOT NULL,
    `animeId` INTEGER NULL,
    `uploadedById` INTEGER NULL,
    `animePictureId` INTEGER NULL,

    UNIQUE INDEX `StorageIndex_name_path_storageId_key`(`name`, `path`, `storageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `settings` JSON NULL,
    `role` ENUM('Default', 'Admin') NOT NULL DEFAULT 'Default',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInfomation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NULL,
    `ownerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeCollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `animeId` INTEGER NOT NULL,
    `status` ENUM('Plan', 'Watching', 'Finished') NOT NULL DEFAULT 'Plan',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AnimeCollection_userId_animeId_key`(`userId`, `animeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InviteCode` (
    `code` VARCHAR(191) NOT NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usedById` INTEGER NULL,
    `usedAt` DATETIME(3) NULL,
    `expiredAt` DATETIME(3) NULL,

    UNIQUE INDEX `InviteCode_usedById_key`(`usedById`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimeViewHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `animeId` INTEGER NOT NULL,
    `libFileId` INTEGER NOT NULL,
    `currentTime` INTEGER NULL,
    `totalTime` INTEGER NULL,
    `userIP` VARCHAR(191) NULL,
    `watchMethod` VARCHAR(191) NULL,
    `storageId` VARCHAR(32) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimePicture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NULL,
    `type` ENUM('Poster', 'Backdrop', 'Episode', 'Other') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `animeId` INTEGER NOT NULL,
    `episodeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AnimeEpisodeToStorageIndex` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AnimeEpisodeToStorageIndex_AB_unique`(`A`, `B`),
    INDEX `_AnimeEpisodeToStorageIndex_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnimeTag` ADD CONSTRAINT `AnimeTag_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeSiteLink` ADD CONSTRAINT `AnimeSiteLink_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeRating` ADD CONSTRAINT `AnimeRating_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeEpisode` ADD CONSTRAINT `AnimeEpisode_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageIndex` ADD CONSTRAINT `StorageIndex_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `Storage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageIndex` ADD CONSTRAINT `StorageIndex_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageIndex` ADD CONSTRAINT `StorageIndex_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StorageIndex` ADD CONSTRAINT `StorageIndex_animePictureId_fkey` FOREIGN KEY (`animePictureId`) REFERENCES `AnimePicture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInfomation` ADD CONSTRAINT `UserInfomation_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeCollection` ADD CONSTRAINT `AnimeCollection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeCollection` ADD CONSTRAINT `AnimeCollection_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_usedById_fkey` FOREIGN KEY (`usedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_libFileId_fkey` FOREIGN KEY (`libFileId`) REFERENCES `StorageIndex`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimeViewHistory` ADD CONSTRAINT `AnimeViewHistory_storageId_fkey` FOREIGN KEY (`storageId`) REFERENCES `Storage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimePicture` ADD CONSTRAINT `AnimePicture_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimePicture` ADD CONSTRAINT `AnimePicture_episodeId_fkey` FOREIGN KEY (`episodeId`) REFERENCES `AnimeEpisode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AnimeEpisodeToStorageIndex` ADD CONSTRAINT `_AnimeEpisodeToStorageIndex_A_fkey` FOREIGN KEY (`A`) REFERENCES `AnimeEpisode`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AnimeEpisodeToStorageIndex` ADD CONSTRAINT `_AnimeEpisodeToStorageIndex_B_fkey` FOREIGN KEY (`B`) REFERENCES `StorageIndex`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
