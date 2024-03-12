/*
  Warnings:

  - You are about to drop the column `email` on the `owners` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "owners_email";

-- AlterTable
ALTER TABLE "owners" DROP COLUMN "email",
ADD COLUMN     "admin_flag" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));

-- DropTable
DROP TABLE "admins";
