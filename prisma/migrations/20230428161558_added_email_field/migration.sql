-- AlterTable
ALTER TABLE "owner_details" ADD COLUMN     "owner_email" VARCHAR(255);

-- AlterTable
ALTER TABLE "tag_details" ADD COLUMN     "tag_email" VARCHAR(255);

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);
