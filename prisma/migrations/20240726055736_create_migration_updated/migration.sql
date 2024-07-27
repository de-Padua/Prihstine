/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pictureId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Address` table. All the data in the column will be lost.
  - Added the required column `cep` to the `Address` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Address` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "pictureId",
DROP COLUMN "pictureUrl",
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "ddd" TEXT,
ADD COLUMN     "ibge" TEXT,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "localidade" TEXT,
ADD COLUMN     "logradouro" TEXT,
ADD COLUMN     "uf" TEXT,
ADD COLUMN     "unidade" TEXT,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");
