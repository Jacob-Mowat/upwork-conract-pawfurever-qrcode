/*
  Warnings:

  - You are about to drop the column `name` on the `tag_details` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `tag_details` table. All the data in the column will be lost.
  - Added the required column `pets_information` to the `tag_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pets_name` to the `tag_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pets_photo_url` to the `tag_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tag_details" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "pets_information" TEXT NOT NULL,
ADD COLUMN     "pets_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "pets_photo_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "tag_address_line1" VARCHAR(255),
ADD COLUMN     "tag_address_line2" VARCHAR(255),
ADD COLUMN     "tag_address_zip" VARCHAR(255),
ADD COLUMN     "tag_phone_number" VARCHAR(255),
ADD COLUMN     "uses_owners_information" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));
