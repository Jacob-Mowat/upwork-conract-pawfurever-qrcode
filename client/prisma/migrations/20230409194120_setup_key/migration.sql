-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "setup_key" VARCHAR(13) NOT NULL DEFAULT concat(concat(concat(concat(LEFT(md5(random()::text), 4), '-'), LEFT(md5(random()::text), 3)), '-'), LEFT(md5(random()::text), 4));
