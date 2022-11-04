/*
  Warnings:

  - A unique constraint covering the columns `[urlSlug]` on the table `Forums` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Forums" ALTER COLUMN "urlSlug" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Forums_urlSlug_key" ON "Forums"("urlSlug");
