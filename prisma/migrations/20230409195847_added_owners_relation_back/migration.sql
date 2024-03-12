-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "owner_id" INTEGER,
ALTER COLUMN "setup_key" SET DEFAULT concat(concat(concat(concat(LEFT(md5(random()::text), 4), '-'), LEFT(md5(random()::text), 3)), '-'), LEFT(md5(random()::text), 4));

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "owner_fk" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
