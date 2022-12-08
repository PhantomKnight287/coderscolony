-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "likedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
