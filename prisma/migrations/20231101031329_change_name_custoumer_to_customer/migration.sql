/*
  Warnings:

  - You are about to drop the column `custoumerId` on the `Sale` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "custoumerId",
ADD COLUMN     "customerId" INTEGER NOT NULL;
