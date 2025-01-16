"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controls/courseController");
const courseController = new courseController_1.CourseController();
const courseRouter = express_1.default.Router();
courseRouter.post("/", courseController.createCourse); // POST: Create a course
courseRouter.get("/", courseController.getAllCourses); // GET: Fetch all courses
courseRouter.get("/:id", courseController.getCourseByID); // GET: Fetch course by ID
courseRouter.put("/:id", courseController.updateCourse); // PUT: Update course by ID
courseRouter.delete("/:id", courseController.deleteCourse); // DELETE: Delete course by ID
exports.default = courseRouter;
