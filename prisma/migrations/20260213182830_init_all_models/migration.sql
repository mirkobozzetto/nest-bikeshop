-- CreateEnum
CREATE TYPE "BikeType" AS ENUM ('ROAD', 'MOUNTAIN', 'CITY', 'ELECTRIC', 'KIDS');

-- CreateEnum
CREATE TYPE "BikeStatus" AS ENUM ('AVAILABLE', 'RENTED', 'SOLD', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "MovementReason" AS ENUM ('PURCHASE', 'SALE', 'RENTAL_OUT', 'RENTAL_RETURN', 'MAINTENANCE', 'LOSS', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('RESERVED', 'ACTIVE', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

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

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" UUID NOT NULL,
    "bike_id" UUID NOT NULL,
    "type" "MovementType" NOT NULL,
    "reason" "MovementReason" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rentals" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "status" "RentalStatus" NOT NULL DEFAULT 'RESERVED',
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "total_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rentals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_items" (
    "id" UUID NOT NULL,
    "rental_id" UUID NOT NULL,
    "bike_id" UUID NOT NULL,
    "daily_rate_cents" INTEGER NOT NULL,

    CONSTRAINT "rental_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDING',
    "total_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_items" (
    "id" UUID NOT NULL,
    "sale_id" UUID NOT NULL,
    "bike_id" UUID NOT NULL,
    "price_cents" INTEGER NOT NULL,

    CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bikes_status_idx" ON "bikes"("status");

-- CreateIndex
CREATE INDEX "bikes_type_status_idx" ON "bikes"("type", "status");

-- CreateIndex
CREATE INDEX "bikes_brand_model_name_idx" ON "bikes"("brand", "model_name");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_email_idx" ON "customers"("email");

-- CreateIndex
CREATE INDEX "customers_last_name_first_name_idx" ON "customers"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "inventory_movements_bike_id_idx" ON "inventory_movements"("bike_id");

-- CreateIndex
CREATE INDEX "inventory_movements_bike_id_date_idx" ON "inventory_movements"("bike_id", "date");

-- CreateIndex
CREATE INDEX "rentals_customer_id_idx" ON "rentals"("customer_id");

-- CreateIndex
CREATE INDEX "rentals_status_idx" ON "rentals"("status");

-- CreateIndex
CREATE INDEX "rentals_start_date_end_date_idx" ON "rentals"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "rental_items_rental_id_idx" ON "rental_items"("rental_id");

-- CreateIndex
CREATE INDEX "rental_items_bike_id_idx" ON "rental_items"("bike_id");

-- CreateIndex
CREATE INDEX "sales_customer_id_idx" ON "sales"("customer_id");

-- CreateIndex
CREATE INDEX "sales_status_idx" ON "sales"("status");

-- CreateIndex
CREATE INDEX "sale_items_sale_id_idx" ON "sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "sale_items_bike_id_idx" ON "sale_items"("bike_id");

-- AddForeignKey
ALTER TABLE "rentals" ADD CONSTRAINT "rentals_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_items" ADD CONSTRAINT "rental_items_rental_id_fkey" FOREIGN KEY ("rental_id") REFERENCES "rentals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
