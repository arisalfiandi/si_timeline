-- DropForeignKey
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_kegiatan_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "public"."Kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
