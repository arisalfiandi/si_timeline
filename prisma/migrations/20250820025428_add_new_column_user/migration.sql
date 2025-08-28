/*
  Warnings:

  - Added the required column `nomor_hp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "nomor_hp" TEXT NOT NULL;
