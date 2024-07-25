/*
  Warnings:

  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_postPostId_fkey";

-- DropForeignKey
ALTER TABLE "passwordChangeSession" DROP CONSTRAINT "passwordChangeSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "userValidation" DROP CONSTRAINT "userValidation_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_postPostId_fkey" FOREIGN KEY ("postPostId") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userValidation" ADD CONSTRAINT "userValidation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passwordChangeSession" ADD CONSTRAINT "passwordChangeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
