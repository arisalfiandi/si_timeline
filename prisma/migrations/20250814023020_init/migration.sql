CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "password_hash" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'local',
    "google_access_token" TEXT,
    "google_refresh_token" TEXT,
    "token_expiry" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kegiatan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMP(6) NOT NULL,
    "tanggal_selesai" TIMESTAMP(6) NOT NULL,
    "timkerjaId" INTEGER NOT NULL,
    "created_by" UUID NOT NULL,

    CONSTRAINT "Kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PesertaKegiatan" (
    "id" SERIAL NOT NULL,
    "kegiatanId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "PesertaKegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimKerja" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "ketuaTimId" UUID NOT NULL,

    CONSTRAINT "TimKerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimKerjaUser" (
    "id" SERIAL NOT NULL,
    "timkerjaId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "TimKerjaUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kegiatan" ADD CONSTRAINT "Kegiatan_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PesertaKegiatan" ADD CONSTRAINT "PesertaKegiatan_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "public"."Kegiatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PesertaKegiatan" ADD CONSTRAINT "PesertaKegiatan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerja" ADD CONSTRAINT "TimKerja_ketuaTimId_fkey" FOREIGN KEY ("ketuaTimId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerjaUser" ADD CONSTRAINT "TimKerjaUser_timkerjaId_fkey" FOREIGN KEY ("timkerjaId") REFERENCES "public"."TimKerja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimKerjaUser" ADD CONSTRAINT "TimKerjaUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
