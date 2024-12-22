import { Course } from "@prisma/client";
import { CreatedCourseDto } from "../dtos/createdCourseDto";

export interface courseServices {
    createCourse(data: CreatedCourseDto):Promise<Course>
    getCourseByID(id: number):Promise<Course | null>
    getAllCourses(): Promise<Course[]>
    updateCourse(id: number, data: Partial<CreatedCourseDto>):Promise<Course>
    deleteCourse(id: number): Promise<void>
}