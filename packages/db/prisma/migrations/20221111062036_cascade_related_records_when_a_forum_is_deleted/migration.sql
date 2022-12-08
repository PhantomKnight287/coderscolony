-- DropForeignKey
ALTER TABLE "ForumMember" DROP CONSTRAINT "ForumMember_forumsId_fkey";

-- DropForeignKey
ALTER TABLE "ForumMember" DROP CONSTRAINT "ForumMember_userId_fkey";

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_forumsId_fkey" FOREIGN KEY ("forumsId") REFERENCES "Forums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
