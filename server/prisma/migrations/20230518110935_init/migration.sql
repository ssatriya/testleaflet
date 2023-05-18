/*
  Warnings:

  - Added the required column `shape` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `map` ADD COLUMN `shape` geometry NOT NULL;
