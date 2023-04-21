-- AlterTable
ALTER TABLE "tag_details" ADD COLUMN     "tag_owners_name" VARCHAR(255);

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));
