-- CreateTable
CREATE TABLE "passwordChangeSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passwordChangeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passwordChangeSession_token_key" ON "passwordChangeSession"("token");

-- CreateIndex
CREATE UNIQUE INDEX "passwordChangeSession_userId_key" ON "passwordChangeSession"("userId");

-- AddForeignKey
ALTER TABLE "passwordChangeSession" ADD CONSTRAINT "passwordChangeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
