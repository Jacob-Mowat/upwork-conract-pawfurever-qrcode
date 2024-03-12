-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(concat(concat(LEFT(md5(random()::text), 4), '-'), LEFT(md5(random()::text), 3)), '-'), LEFT(md5(random()::text), 4));
