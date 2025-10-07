-- CreateEnum
CREATE TYPE "public"."StatusTTE" AS ENUM ('REQUESTED', 'SIGNED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filepath" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mimetype" TEXT,
    "size" INTEGER,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hyperlink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hyperlink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nip" TEXT,
    "nama" TEXT NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "File_created_by_idx" ON "public"."File"("created_by");

-- CreateIndex
CREATE INDEX "File_updated_by_idx" ON "public"."File"("updated_by");

-- CreateIndex
CREATE INDEX "Banner_created_by_idx" ON "public"."Banner"("created_by");

-- CreateIndex
CREATE INDEX "Banner_updated_by_idx" ON "public"."Banner"("updated_by");

-- CreateIndex
CREATE INDEX "Hyperlink_created_by_idx" ON "public"."Hyperlink"("created_by");

-- CreateIndex
CREATE INDEX "Hyperlink_updated_by_idx" ON "public"."Hyperlink"("updated_by");

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "public"."User"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "User_nip_key" ON "public"."User"("nip");

-- CreateIndex
CREATE INDEX "User_created_by_idx" ON "public"."User"("created_by");

-- CreateIndex
CREATE INDEX "User_updated_by_idx" ON "public"."User"("updated_by");

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Banner" ADD CONSTRAINT "Banner_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Banner" ADD CONSTRAINT "Banner_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Hyperlink" ADD CONSTRAINT "Hyperlink_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Hyperlink" ADD CONSTRAINT "Hyperlink_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."User"("nip") ON DELETE SET NULL ON UPDATE CASCADE;
