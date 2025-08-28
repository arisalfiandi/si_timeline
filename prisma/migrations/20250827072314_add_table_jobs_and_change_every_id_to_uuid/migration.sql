/*
  Warnings:

  - The primary key for the `Kegiatan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Kegiatan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timkerjaId` column on the `Kegiatan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `KegiatanUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `KegiatanUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TimKerja` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TimKerja` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TimKerjaUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TimKerjaUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `kegiatanId` on the `KegiatanUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timkerjaId` on the `TimKerjaUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Kegiatan" DROP CONSTRAINT "Kegiatan_timkerjaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."KegiatanUser" DROP CONSTRAINT "KegiatanUser_kegiatanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TimKerjaUser" DROP CONSTRAINT "TimKerjaUser_timkerjaId_fkey";

-- AlterTable
ALTER TABLE "public"."Kegiatan" DROP CONSTRAINT "Kegiatan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "timkerjaId",
ADD COLUMN     "timkerjaId" UUID,
ADD CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."KegiatanUser" DROP CONSTRAINT "KegiatanUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "kegiatanId",
ADD COLUMN     "kegiatanId" UUID NOT NULL,
ADD CONSTRAINT "KegiatanUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."TimKerja" DROP CONSTRAINT "TimKerja_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "TimKerja_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."TimKerjaUser" DROP CONSTRAINT "TimKerjaUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "timkerjaId",
ADD COLUMN     "timkerjaId" UUID NOT NULL,
ADD CONSTRAINT "TimKerjaUser_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."Jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "kegiatan_id" UUID NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Jobs_user_id_idx" ON "public"."Jobs"("user_id");

-- CreateIndex
CREATE INDEX "Kegiatan_created_by_idx" ON "public"."Kegiatan"("created_by");

-- CreateIndex
CREATE INDEX "Kegiatan_timkerjaId_idx" ON "public"."Kegiatan"("timkerjaId");

-- CreateIndex
CREATE INDEX "KegiatanUser_kegiatanId_idx" ON "public"."KegiatanUser"("kegiatanId");

-- CreateIndex
CREATE INDEX "KegiatanUser_userId_idx" ON "public"."KegiatanUser"("userId");

-- CreateIndex
CREATE INDEX "TimKerja_ketuaTimId_idx" ON "public"."TimKerja"("ketuaTimId");

-- CreateIndex
CREATE INDEX "TimKerjaUser_timkerjaId_idx" ON "public"."TimKerjaUser"("timkerjaId");

-- CreateIndex
CREATE INDEX "TimKerjaUser_userId_idx" ON "public"."TimKerjaUser"("userId");

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KegiatanUser" ADD CONSTRAINT "KegiatanUser_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "public"."Kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerjaUser" ADD CONSTRAINT "TimKerjaUser_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_kegiatan_id_fkey" FOREIGN KEY ("kegiatan_id") REFERENCES "public"."Kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
