-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'worker',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shifts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "clock_in_time" TIMESTAMP(3) NOT NULL,
    "clock_in_latitude" DOUBLE PRECISION NOT NULL,
    "clock_in_longitude" DOUBLE PRECISION NOT NULL,
    "clock_out_time" TIMESTAMP(3),
    "clock_out_latitude" DOUBLE PRECISION,
    "clock_out_longitude" DOUBLE PRECISION,
    "notes" TEXT,
    "duration_minutes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "shifts_user_id_idx" ON "public"."shifts"("user_id");

-- CreateIndex
CREATE INDEX "shifts_clock_in_time_idx" ON "public"."shifts"("clock_in_time");

-- CreateIndex
CREATE INDEX "shifts_user_id_clock_out_time_idx" ON "public"."shifts"("user_id", "clock_out_time");

-- AddForeignKey
ALTER TABLE "public"."shifts" ADD CONSTRAINT "shifts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
