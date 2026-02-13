-- CreateEnum
CREATE TYPE "BikeType" AS ENUM ('ROAD', 'MOUNTAIN', 'CITY', 'ELECTRIC', 'KIDS');

-- CreateEnum
CREATE TYPE "BikeStatus" AS ENUM ('AVAILABLE', 'RENTED', 'SOLD', 'MAINTENANCE', 'RETIRED');

-- CreateTable
CREATE TABLE "bikes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "type" "BikeType" NOT NULL,
    "size" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "daily_rate_cents" INTEGER NOT NULL,
    "status" "BikeStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bikes_status_idx" ON "bikes"("status");

-- CreateIndex
CREATE INDEX "bikes_type_status_idx" ON "bikes"("type", "status");

-- CreateIndex
CREATE INDEX "bikes_brand_model_name_idx" ON "bikes"("brand", "model_name");
