/*
  Warnings:

  - A unique constraint covering the columns `[instructorID]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE course_instructorid_seq;
ALTER TABLE "Course" ALTER COLUMN "instructorID" SET DEFAULT nextval('course_instructorid_seq');
ALTER SEQUENCE course_instructorid_seq OWNED BY "Course"."instructorID";

-- CreateIndex
CREATE UNIQUE INDEX "Course_instructorID_key" ON "Course"("instructorID");
