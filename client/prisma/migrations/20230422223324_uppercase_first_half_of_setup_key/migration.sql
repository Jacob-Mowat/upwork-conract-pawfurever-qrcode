-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(md5(random()::text), 4)), '-'), concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int));
