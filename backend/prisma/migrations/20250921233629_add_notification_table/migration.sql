-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "public"."Notification"("created_at");

-- CreateIndex
CREATE INDEX "Notification_updated_at_idx" ON "public"."Notification"("updated_at");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "public"."Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_title_idx" ON "public"."Notification"("title");

-- CreateIndex
CREATE INDEX "Notification_message_idx" ON "public"."Notification"("message");

-- CreateIndex
CREATE INDEX "Notification_data_idx" ON "public"."Notification"("data");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("nip") ON DELETE RESTRICT ON UPDATE CASCADE;
