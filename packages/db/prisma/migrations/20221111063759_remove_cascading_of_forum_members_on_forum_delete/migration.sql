-- DropForeignKey
ALTER TABLE "ForumMember" DROP CONSTRAINT "ForumMember_forumsId_fkey";

-- AddForeignKey
ALTER TABLE "ForumMember" ADD CONSTRAINT "ForumMember_forumsId_fkey" FOREIGN KEY ("forumsId") REFERENCES "Forums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
