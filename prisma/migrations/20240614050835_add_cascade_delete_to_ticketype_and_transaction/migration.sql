-- DropForeignKey
ALTER TABLE `Tickettype` DROP FOREIGN KEY `Tickettype_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_eventId_fkey`;

-- AddForeignKey
ALTER TABLE `Tickettype` ADD CONSTRAINT `Tickettype_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
