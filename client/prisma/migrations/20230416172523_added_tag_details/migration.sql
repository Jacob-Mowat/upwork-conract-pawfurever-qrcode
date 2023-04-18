/*
  Warnings:

  - A unique constraint covering the columns `[owner_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tag_details_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "tag_details_id" INTEGER,
ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));

-- CreateTable
CREATE TABLE "tag_details" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "tag_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owner_id" ON "tags"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_details_id" ON "tags"("tag_details_id");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tag_details_fk" FOREIGN KEY ("tag_details_id") REFERENCES "tag_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
