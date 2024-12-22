import express from "express";
import { CourseController } from "../controls/courseController";

const courseController = new CourseController();
const courseRouter = express.Router();

courseRouter.post("/", courseController.createCourse); // POST: Create a course
courseRouter.get("/", courseController.getAllCourses); // GET: Fetch all courses
courseRouter.get("/:id", courseController.getCourseByID); // GET: Fetch course by ID
courseRouter.put("/:id", courseController.updateCourse); // PUT: Update course by ID
courseRouter.delete("/:id", courseController.deleteCourse); // DELETE: Delete course by ID

export default courseRouter;