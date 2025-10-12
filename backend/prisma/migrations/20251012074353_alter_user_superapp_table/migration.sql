/*
  Warnings:

  - You are about to drop the column `username` on the `UserSuperApp` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserSuperApp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UserSuperApp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserSuperApp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Hyperlink" DROP CONSTRAINT "Hyperlink_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Hyperlink" DROP CONSTRAINT "Hyperlink_updated_by_fkey";

-- DropIndex
DROP INDEX "public"."UserSuperApp_username_idx";

-- DropIndex
DROP INDEX "public"."UserSuperApp_username_key";

-- AlterTable
ALTER TABLE "UserSuperApp" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSuperApp_email_key" ON "UserSuperApp"("email");

-- CreateIndex
CREATE INDEX "UserSuperApp_email_idx" ON "UserSuperApp"("email");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hyperlink" ADD CONSTRAINT "Hyperlink_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hyperlink" ADD CONSTRAINT "Hyperlink_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "UserSuperApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
