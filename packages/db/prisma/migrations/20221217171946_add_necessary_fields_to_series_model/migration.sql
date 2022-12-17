/*
  Warnings:

  - Added the required column `image` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
