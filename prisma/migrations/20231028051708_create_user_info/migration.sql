/*
  Warnings:

  - A unique constraint covering the columns `[citizenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sold` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "sold" INTEGER NOT NULL,
ADD COLUMN     "viewer" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "citizenId" TEXT NOT NULL,
ADD COLUMN     "tel" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_citizenId_key" ON "User"("citizenId");
