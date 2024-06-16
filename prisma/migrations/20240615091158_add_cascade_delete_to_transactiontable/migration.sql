-- DropForeignKey
ALTER TABLE `Nft` DROP FOREIGN KEY `Nft_txnId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_ticketTypeId_fkey`;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_ticketTypeId_fkey` FOREIGN KEY (`ticketTypeId`) REFERENCES `Tickettype`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nft` ADD CONSTRAINT `Nft_txnId_fkey` FOREIGN KEY (`txnId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
