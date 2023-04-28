/*
  Warnings:

  - A unique constraint covering the columns `[owner_email]` on the table `owner_details` will be added. If there are existing duplicate values, this will fail.
  - Made the column `owner_email` on table `owner_details` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "owner_details" ALTER COLUMN "owner_email" SET NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);

-- CreateIndex
CREATE UNIQUE INDEX "owner_details_owner_email_key" ON "owner_details"("owner_email");
