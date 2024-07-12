/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `userValidation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userValidation_userId_key" ON "userValidation"("userId");
