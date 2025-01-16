"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseServiceImpl = void 0;
const db_1 = require("../config/db");
const customerror_1 = require("../error/customerror");
const process_1 = require("process");
class courseServiceImpl {
    createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const CourseExists = yield db_1.db.course.findFirst({
                where: { title: process_1.title }
            });
            if (CourseExists) {
                throw new customerror_1.CustomError(409, "Already exists");
            }
            const course = yield db_1.db.course.create({
                data: {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    duration: data.duration,
                },
            });
            return course;
        });
    }
    getCourseByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield db_1.db.course.findUnique({
                where: { id },
            });
            if (!course) {
                throw new customerror_1.CustomError(404, `Course with ${id} doesnt exist`);
            }
            return course;
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.course.findMany();
        });
    }
    updateCourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCourseexists = yield db_1.db.course.findFirst({
                where: {
                    id,
                },
            });
            if (!isCourseexists) {
                throw new customerror_1.CustomError(404, "This course does not exist");
            }
            const course = yield db_1.db.course.update({
                where: { id },
                data,
            });
            return course;
        });
    }
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCourseexists = yield db_1.db.course.findFirst({
                where: {
                    id,
                },
            });
            if (!isCourseexists) {
                throw new customerror_1.CustomError(404, "This course does not exist");
            }
            const course = yield db_1.db.course.delete({
                where: { id },
            });
        });
    }
}
exports.courseServiceImpl = courseServiceImpl;
