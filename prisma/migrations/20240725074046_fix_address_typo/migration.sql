/*
  Warnings:

  - You are about to drop the column `adress` on the `Post` table. All the data in the column will be lost.
  - Added the required column `address` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT NOT NULL;
