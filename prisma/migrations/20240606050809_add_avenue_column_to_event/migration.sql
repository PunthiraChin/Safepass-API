-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(256) NULL,
    `googleId` VARCHAR(256) NULL,
    `walletAddress` VARCHAR(50) NULL,
    `firstName` VARCHAR(50) NULL,
    `lastName` VARCHAR(50) NULL,
    `role` ENUM('ADMIN', 'CUSTOMER') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `details` TEXT NOT NULL,
    `organizer` VARCHAR(50) NOT NULL,
    `avenue` VARCHAR(50) NOT NULL,
    `coverImage` VARCHAR(256) NOT NULL,
    `profileImage` VARCHAR(256) NOT NULL,
    `seatMapImage` VARCHAR(256) NOT NULL,
    `contractAddress` VARCHAR(50) NOT NULL,
    `startDateTime` TIMESTAMP(0) NOT NULL,
    `endDateTime` TIMESTAMP(0) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `Event_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tickettype` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `details` VARCHAR(50) NOT NULL,
    `maximumSeat` INTEGER NOT NULL,
    `remainingSeat` INTEGER NOT NULL,
    `ticketImage` VARCHAR(256) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` INTEGER NOT NULL,
    `ticketTypeId` INTEGER NOT NULL,
    `ticketAmount` INTEGER NOT NULL,
    `txnStatus` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nft` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenId` INTEGER NOT NULL,
    `openSeaUrl` VARCHAR(256) NULL,
    `txnId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tickettype` ADD CONSTRAINT `Tickettype_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ticketTypeId_fkey` FOREIGN KEY (`ticketTypeId`) REFERENCES `Tickettype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nft` ADD CONSTRAINT `Nft_txnId_fkey` FOREIGN KEY (`txnId`) REFERENCES `Transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
