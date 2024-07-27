/*
  Warnings:

  - You are about to drop the column `postDescrition` on the `Post` table. All the data in the column will be lost.
  - Added the required column `postDescription` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postDescrition",
ADD COLUMN     "postDescription" TEXT NOT NULL;
