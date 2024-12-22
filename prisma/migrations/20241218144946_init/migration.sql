/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseID]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorID_fkey";

-- AlterTable
CREATE SEQUENCE enrollment_userid_seq;
CREATE SEQUENCE enrollment_courseid_seq;
ALTER TABLE "Enrollment" ALTER COLUMN "userID" SET DEFAULT nextval('enrollment_userid_seq'),
ALTER COLUMN "courseID" SET DEFAULT nextval('enrollment_courseid_seq');
ALTER SEQUENCE enrollment_userid_seq OWNED BY "Enrollment"."userID";
ALTER SEQUENCE enrollment_courseid_seq OWNED BY "Enrollment"."courseID";

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userID_key" ON "Enrollment"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_courseID_key" ON "Enrollment"("courseID");
