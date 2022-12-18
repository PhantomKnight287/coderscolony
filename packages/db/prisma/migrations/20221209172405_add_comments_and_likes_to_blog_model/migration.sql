-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_postsId_fkey";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "blogId" TEXT,
ALTER COLUMN "postsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postsId_fkey" FOREIGN KEY ("postsId") REFERENCES "Posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
