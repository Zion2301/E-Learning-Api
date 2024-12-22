import { Response, Request, NextFunction } from "express";
import { courseServiceImpl } from "../service/courseServiceImpl";
import { CreatedCourseDto } from "../dtos/createdCourseDto";

export class CourseController {
    private userService: courseServiceImpl;

    constructor() {
       this.userService = new courseServiceImpl;
    }

    public createCourse = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try{
            const courseData = req.body as CreatedCourseDto;
            const newCourse = await this.userService.createCourse(courseData);
            res.status(201).json(newCourse);
        }catch (error){
            next(error);
        }
    }

public getCourseByID = async (
    req: Request,
    res: Response,
    next: NextFunction
   ):Promise<void | any> => {
    try {
        const courseId = parseInt(req.params.id);
        const course = await this.userService.getCourseByID(courseId);
        if(!course) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(course);
    } catch(error) {
      next(error)
    }
   }

   public getAllCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
   ):Promise<void | any> => {
    try {
        const course = await this.userService.getAllCourses();
        res.status(200).json(course);
    } catch(error) {
      next(error)
    }
   }

   public updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
   ):Promise<void | any> => {
    try {
        const courseId = parseInt(req.params.id);
        const CourseData = req.body as Partial<CreatedCourseDto>;
        const updatedCourse = await this.userService.updateCourse(courseId, CourseData)
        res.status(200).json(updatedCourse);
    } catch(error) {
      next(error)
    }
   }


   public deleteCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
   ):Promise<void> => {
    try {
        const courseId = parseInt(req.params.id);
        const courseData = req.body as Partial<CreatedCourseDto>;
        const updatedUser = await this.userService.deleteCourse(courseId)
        res.status(200).json();
    } catch(error) {
      next(error)
    }
   }

}