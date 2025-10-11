-- CreateTable
CREATE TABLE "UserSuperApp" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSuperApp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSuperApp_username_key" ON "UserSuperApp"("username");

-- CreateIndex
CREATE INDEX "UserSuperApp_username_idx" ON "UserSuperApp"("username");

-- CreateIndex
CREATE INDEX "UserSuperApp_created_at_idx" ON "UserSuperApp"("created_at");

-- CreateIndex
CREATE INDEX "UserSuperApp_updated_at_idx" ON "UserSuperApp"("updated_at");
