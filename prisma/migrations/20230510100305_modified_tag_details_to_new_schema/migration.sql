/*
  Warnings:

  - You are about to drop the column `pet_allergies` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_behavior` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_bio` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_birthday` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_breed` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_gender` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_microchip_number` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pet_spayed_neutered` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pets_information` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pets_name` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `pets_photo_url` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_address_line1` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_address_line2` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_address_zip` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_email` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_owners_name` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_phone_number` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `tag_phone_number2` on the `tag_details` table. All the data in the column will be lost.
  - Added the required column `name` to the `tag_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_email` to the `tag_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_name` to the `tag_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_phone_number` to the `tag_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tag_details" DROP COLUMN "pet_allergies",
DROP COLUMN "pet_behavior",
DROP COLUMN "pet_bio",
DROP COLUMN "pet_birthday",
DROP COLUMN "pet_breed",
DROP COLUMN "pet_gender",
DROP COLUMN "pet_microchip_number",
DROP COLUMN "pet_spayed_neutered",
DROP COLUMN "pets_information",
DROP COLUMN "pets_name",
DROP COLUMN "pets_photo_url",
DROP COLUMN "tag_address_line1",
DROP COLUMN "tag_address_line2",
DROP COLUMN "tag_address_zip",
DROP COLUMN "tag_email",
DROP COLUMN "tag_owners_name",
DROP COLUMN "tag_phone_number",
DROP COLUMN "tag_phone_number2",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "behaviour" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthday" TIMESTAMP(6),
ADD COLUMN     "breed" VARCHAR(255),
ADD COLUMN     "gender" VARCHAR(255),
ADD COLUMN     "microchip_number" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "neutered_spayed" BOOLEAN DEFAULT false,
ADD COLUMN     "parent_apt_suite_unit" VARCHAR(255),
ADD COLUMN     "parent_city" VARCHAR(255),
ADD COLUMN     "parent_email" VARCHAR(255) NOT NULL,
ADD COLUMN     "parent_email_additional" VARCHAR(255),
ADD COLUMN     "parent_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "parent_phone_number" VARCHAR(255) NOT NULL,
ADD COLUMN     "parent_phone_number_additional_1" VARCHAR(255),
ADD COLUMN     "parent_phone_number_additional_2" VARCHAR(255),
ADD COLUMN     "parent_state" VARCHAR(255),
ADD COLUMN     "parent_street_address" VARCHAR(255),
ADD COLUMN     "parent_zipcode" VARCHAR(255),
ADD COLUMN     "photo_url" VARCHAR(255),
ALTER COLUMN "uses_owners_information" SET DEFAULT true;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);
