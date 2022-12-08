-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_blogId_fkey";

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "seriesId" TEXT;

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "seriesId" TEXT;

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SeriesToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Series_id_key" ON "Series"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogToTags_AB_unique" ON "_BlogToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogToTags_B_index" ON "_BlogToTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SeriesToTags_AB_unique" ON "_SeriesToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_SeriesToTags_B_index" ON "_SeriesToTags"("B");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToTags" ADD CONSTRAINT "_BlogToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToTags" ADD CONSTRAINT "_BlogToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesToTags" ADD CONSTRAINT "_SeriesToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesToTags" ADD CONSTRAINT "_SeriesToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
