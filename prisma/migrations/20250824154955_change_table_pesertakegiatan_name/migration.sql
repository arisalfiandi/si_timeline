/*
  Warnings:

  - You are about to drop the `PesertaKegiatan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PesertaKegiatan" DROP CONSTRAINT "PesertaKegiatan_kegiatanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PesertaKegiatan" DROP CONSTRAINT "PesertaKegiatan_userId_fkey";

-- DropTable
DROP TABLE "public"."PesertaKegiatan";

-- CreateTable
CREATE TABLE "public"."KegiatanUser" (
    "id" SERIAL NOT NULL,
    "kegiatanId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "KegiatanUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."KegiatanUser" ADD CONSTRAINT "KegiatanUser_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "public"."Kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KegiatanUser" ADD CONSTRAINT "KegiatanUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
