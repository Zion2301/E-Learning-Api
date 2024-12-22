import { Course } from "@prisma/client";
import { db } from "../config/db";

import { CreatedCourseDto } from "../dtos/createdCourseDto";
import { courseServices } from "./courseService";
import { CustomError } from "../error/customerror";
import { title } from "process";
export class courseServiceImpl implements courseServices {
   async createCourse(data: CreatedCourseDto): Promise<Course> {
const CourseExists = await db.course.findFirst({
   where: {title}
})
  if(CourseExists) {
   throw new CustomError(409, "Already exists");
   
  }
      const course = await db.course.create({
        data: {
            title: data.title,
            description: data.description,
            price: data.price,
            duration: data.duration,
        },
      })
      return course;
    }
   async getCourseByID(id: number): Promise<Course | null> {
      const course = await db.course.findUnique({
         where: {id},
      });
      if(!course) {
         throw new CustomError(404, `Course with ${id} doesnt exist`);
         
      }
      return course;  
    }

   async getAllCourses(): Promise<Course[]> {
        return await db.course.findMany();
    }
   async updateCourse(id: number, data: Partial<CreatedCourseDto>): Promise<Course> {
        const isCourseexists = await db.course.findFirst({
            where: {
               id,
            },
         });
   
         if(!isCourseexists){
            throw new CustomError(404, "This course does not exist");
            
         }
         const course = await db.course.update({
            where: {id},
            data,
         })
         return course;
    }
   async deleteCourse(id: number): Promise<void> {
        const isCourseexists = await db.course.findFirst({
            where: {
               id,
            },
         });
   
         if(!isCourseexists){
            throw new CustomError(404, "This course does not exist");
            
         }
         const course = await db.course.delete({
            where: {id},
         })
    }

}