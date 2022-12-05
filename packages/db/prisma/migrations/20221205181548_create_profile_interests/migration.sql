-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileViews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ProfileInterests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT DEFAULT 'cyan',

    CONSTRAINT "ProfileInterests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileInterestsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileInterests_id_key" ON "ProfileInterests"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileInterestsToUser_AB_unique" ON "_ProfileInterestsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileInterestsToUser_B_index" ON "_ProfileInterestsToUser"("B");

-- AddForeignKey
ALTER TABLE "_ProfileInterestsToUser" ADD CONSTRAINT "_ProfileInterestsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ProfileInterests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileInterestsToUser" ADD CONSTRAINT "_ProfileInterestsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
