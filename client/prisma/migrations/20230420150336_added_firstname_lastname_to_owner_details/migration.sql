/*
  Warnings:

  - Added the required column `owner_firstname` to the `owner_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_lastname` to the `owner_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "owner_details" ADD COLUMN     "owner_firstname" VARCHAR(255) NOT NULL,
ADD COLUMN     "owner_lastname" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));
