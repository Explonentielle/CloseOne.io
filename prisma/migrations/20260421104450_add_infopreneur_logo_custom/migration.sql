-- AlterTable
ALTER TABLE "Infopreneur" ADD COLUMN     "createdByUserId" TEXT,
ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logo" TEXT;

-- AddForeignKey
ALTER TABLE "Infopreneur" ADD CONSTRAINT "Infopreneur_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
