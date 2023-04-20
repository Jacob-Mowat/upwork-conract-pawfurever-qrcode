/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `owners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "user_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(LEFT(md5(random()::text), 3), '-'), LEFT(md5(random()::text), 4));

-- CreateIndex
CREATE UNIQUE INDEX "owners_user_id" ON "owners"("user_id");
