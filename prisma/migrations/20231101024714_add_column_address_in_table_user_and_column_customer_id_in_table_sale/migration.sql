/*
  Warnings:

  - Added the required column `custoumerId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "custoumerId" INTEGER NOT NULL ;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL ;
