/*
  Warnings:

  - Added the required column `slug` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "slug" TEXT NOT NULL;
