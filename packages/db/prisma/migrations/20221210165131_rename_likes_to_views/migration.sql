/*
  Warnings:

  - You are about to drop the column `likes` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "likes",
ADD COLUMN     "views" TEXT[];
