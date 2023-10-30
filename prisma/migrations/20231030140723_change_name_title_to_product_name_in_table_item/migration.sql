/*
  Warnings:

  - You are about to drop the column `title` on the `Item` table. All the data in the column will be lost.
  - Added the required column `productName` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" RENAME COLUMN "title" to  "productName";

