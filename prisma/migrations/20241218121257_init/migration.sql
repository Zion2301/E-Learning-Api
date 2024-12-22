/*
  Warnings:

  - Added the required column `Duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "Duration" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "instructorId" INTEGER NOT NULL;
