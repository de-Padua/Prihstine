/*
  Warnings:

  - You are about to drop the column `postPostId` on the `Picture` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Post` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Picture` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Picture" DROP CONSTRAINT "Picture_postPostId_fkey";

-- AlterTable
ALTER TABLE "Picture" DROP COLUMN "postPostId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "address",
DROP COLUMN "cep",
DROP COLUMN "state";

-- CreateTable
CREATE TABLE "Address" (
    "postId" TEXT NOT NULL,
    "pictureId" TEXT NOT NULL,
    "pictureUrl" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("pictureId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_postId_key" ON "Address"("postId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;
