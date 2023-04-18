/*
  Warnings:

  - A unique constraint covering the columns `[TAG_TOKEN]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[setup_key]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(concat(concat(LEFT(md5(random()::text), 4), '-'), LEFT(md5(random()::text), 3)), '-'), LEFT(md5(random()::text), 4));

-- CreateIndex
CREATE UNIQUE INDEX "tag_token" ON "tags"("TAG_TOKEN");

-- CreateIndex
CREATE UNIQUE INDEX "tag_setup_key" ON "tags"("setup_key");
