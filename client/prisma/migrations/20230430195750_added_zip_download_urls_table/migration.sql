-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "zip_download_urlsId" INTEGER,
ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);

-- CreateTable
CREATE TABLE "zip_download_urls" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zip_file_name" VARCHAR(255) NOT NULL,
    "zip_file_url" VARCHAR(255) NOT NULL,
    "num_of_tags" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "zip_download_urls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_zip_download_urlsId_fkey" FOREIGN KEY ("zip_download_urlsId") REFERENCES "zip_download_urls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
