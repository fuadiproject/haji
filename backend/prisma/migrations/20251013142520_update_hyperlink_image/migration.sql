-- AddForeignKey
ALTER TABLE "Hyperlink" ADD CONSTRAINT "Hyperlink_logo_fkey" FOREIGN KEY ("logo") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
