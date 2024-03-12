/*
  Warnings:

  - A unique constraint covering the columns `[owner_details_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "owner_id";

-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "owner_details_id" INTEGER;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));

-- CreateTable
CREATE TABLE "owner_details" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_phone_number" VARCHAR(255) NOT NULL,
    "owner_address_line1" VARCHAR(255) NOT NULL,
    "owner_address_line2" VARCHAR(255) NOT NULL,
    "owner_address_zip" VARCHAR(255) NOT NULL,

    CONSTRAINT "owner_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_details_id" ON "owners"("owner_details_id");

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owner_details_fk" FOREIGN KEY ("owner_details_id") REFERENCES "owner_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
