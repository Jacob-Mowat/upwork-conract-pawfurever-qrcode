-- AlterTable
ALTER TABLE "tag_details" ADD COLUMN     "pet_allergies" TEXT,
ADD COLUMN     "pet_behavior" TEXT,
ADD COLUMN     "pet_bio" TEXT,
ADD COLUMN     "pet_birthday" TIMESTAMP(6),
ADD COLUMN     "pet_breed" VARCHAR(255),
ADD COLUMN     "pet_gender" VARCHAR(255),
ADD COLUMN     "pet_microchip_number" VARCHAR(255),
ADD COLUMN     "pet_spayed_neutered" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "setup_key" SET DEFAULT concat(concat(upper(LEFT(REGEXP_REPLACE(md5(random()::text),'[[:digit:]]','','g'), 3)), '-'), concat(concat(concat(floor(random() * (9-0+1) + 0)::int, floor(random() * (9-0+1) + 0)::int), floor(random() * (9-0+1) + 0)::int)),floor(random() * (9-0+1) + 0)::int);
