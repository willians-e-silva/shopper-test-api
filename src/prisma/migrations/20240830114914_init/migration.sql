-- CreateTable
CREATE TABLE `customer_measurement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_code` VARCHAR(255) NOT NULL,
    `measure_type` VARCHAR(255) NOT NULL,
    `measure_datetime` DATE NOT NULL,
    `image_url` LONGBLOB NOT NULL,
    `measure_uuid` VARCHAR(36) NOT NULL,
    `has_confirmed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
