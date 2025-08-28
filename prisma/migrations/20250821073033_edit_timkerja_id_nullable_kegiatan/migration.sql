-- DropForeignKey
ALTER TABLE "public"."Kegiatan" DROP CONSTRAINT "Kegiatan_timkerjaId_fkey";

-- AlterTable
ALTER TABLE "public"."Kegiatan" ALTER COLUMN "timkerjaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;
