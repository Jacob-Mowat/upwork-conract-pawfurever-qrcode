/*
  Warnings:

  - You are about to drop the column `owner_id` on the `tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "owner_fk";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "owner_id",
ALTER COLUMN "setup_key" SET DEFAULT concat(concat(concat(concat(LEFT(md5(random()::text), 4), '-'), LEFT(md5(random()::text), 3)), '-'), LEFT(md5(random()::text), 4));
