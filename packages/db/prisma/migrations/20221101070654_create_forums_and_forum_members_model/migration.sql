-- CreateEnum
CREATE TYPE "ForumMemberRoles" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateTable
CREATE TABLE "Forums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileImage" TEXT,
    "bannerImage" TEXT,

    CONSTRAINT "Forums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumMember" (
    "id" TEXT NOT NULL,
    "role" "ForumMemberRoles" NOT NULL,
    "userId" TEXT NOT NULL,
    "forumsId" TEXT NOT NULL,

    CONSTRAINT "ForumMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Forums_id_key" ON "Forums"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ForumMember_id_key" ON "ForumMember"("id");

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_forumsId_fkey" FOREIGN KEY ("forumsId") REFERENCES "Forums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
