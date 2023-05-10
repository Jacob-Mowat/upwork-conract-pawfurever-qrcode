/*
  Warnings:

  - You are about to drop the column `owner_address_line1` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_address_line2` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_address_zip` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_email` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_firstname` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_lastname` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_phone_number` on the `owner_details` table. All the data in the column will be lost.
  - You are about to drop the column `owner_phone_number2` on the `owner_details` table. All the data in the column will be lost.
  - Added the required column `email` to the `owner_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `owner_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `owner_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "owner_details_owner_email_key";

-- AlterTable
ALTER TABLE "owner_details" DROP COLUMN "owner_address_line1",
DROP COLUMN "owner_address_line2",
DROP COLUMN "owner_address_zip",
DROP COLUMN "owner_email",
DROP COLUMN "owner_firstname",
DROP COLUMN "owner_lastname",
DROP COLUMN "owner_phone_number",
DROP COLUMN "owner_phone_number2",
ADD COLUMN     "apt_suite_unit" VARCHAR(255),
ADD COLUMN     "city" VARCHAR(255),
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "email_additional" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone_number" VARCHAR(255) NOT NULL,
ADD COLUMN     "phone_number_additional_1" VARCHAR(255),
ADD COLUMN     "phone_number_additional_2" VARCHAR(255),
ADD COLUMN     "state" VARCHAR(255),
ADD COLUMN     "street_address" VARCHAR(255),
ADD COLUMN     "zipcode" VARCHAR(255);

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);
