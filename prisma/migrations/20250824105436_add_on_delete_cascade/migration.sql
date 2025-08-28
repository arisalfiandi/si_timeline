-- DropForeignKey
ALTER TABLE "public"."Kegiatan" DROP CONSTRAINT "Kegiatan_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Kegiatan" DROP CONSTRAINT "Kegiatan_timkerjaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PesertaKegiatan" DROP CONSTRAINT "PesertaKegiatan_kegiatanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PesertaKegiatan" DROP CONSTRAINT "PesertaKegiatan_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimKerja" DROP CONSTRAINT "TimKerja_ketuaTimId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimKerjaUser" DROP CONSTRAINT "TimKerjaUser_timkerjaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimKerjaUser" DROP CONSTRAINT "TimKerjaUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PesertaKegiatan" ADD CONSTRAINT "PesertaKegiatan_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "public"."Kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PesertaKegiatan" ADD CONSTRAINT "PesertaKegiatan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerja" ADD CONSTRAINT "TimKerja_ketuaTimId_fkey" FOREIGN KEY ("ketuaTimId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerjaUser" ADD CONSTRAINT "TimKerjaUser_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerjaUser" ADD CONSTRAINT "TimKerjaUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
