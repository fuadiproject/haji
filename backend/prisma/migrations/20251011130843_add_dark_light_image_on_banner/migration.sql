/*
  Warnings:

  - You are about to drop the column `file_id` on the `Banner` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Banner" DROP CONSTRAINT "Banner_file_id_fkey";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "file_id",
ADD COLUMN     "dark_image" TEXT,
ADD COLUMN     "light_image" TEXT;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_dark_image_fkey" FOREIGN KEY ("dark_image") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_light_image_fkey" FOREIGN KEY ("light_image") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
