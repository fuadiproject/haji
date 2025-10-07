/*
  Warnings:

  - You are about to drop the column `image` on the `Banner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Banner" DROP COLUMN "image",
ADD COLUMN     "file_id" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Banner" ADD CONSTRAINT "Banner_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
