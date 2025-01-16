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
exports.UserServiceImpl = void 0;
const db_1 = require("../config/db");
const customerror_1 = require("../error/customerror");
const password_utils_1 = require("../error/password.utils");
const http_status_codes_1 = require("http-status-codes");
class UserServiceImpl {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserExist = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (isUserExist) {
                throw new customerror_1.CustomError(409, "Email already taken");
            }
            const user = yield db_1.db.user.create({
                data: {
                    email: data.email,
                    password: yield (0, password_utils_1.hashPassword)(data.password),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                },
            });
            return user;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: { id },
            });
            if (!user) {
                throw new customerror_1.CustomError(404, `User with ${id} doesnt exist`);
            }
            return user;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.db.user.findMany();
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserexists = yield db_1.db.user.findFirst({
                where: {
                    id,
                },
            });
            if (!isUserexists) {
                throw new customerror_1.CustomError(404, "User with this ID does not exist");
            }
            const user = yield db_1.db.user.update({
                where: { id },
                data,
            });
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserexists = yield db_1.db.user.findFirst({
                where: {
                    id,
                },
            });
            if (!isUserexists) {
                throw new customerror_1.CustomError(404, "User with this ID does not exist");
            }
            yield db_1.db.user.delete({
                where: { id }
            });
        });
    }
    profile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: {
                    id,
                }
            });
            if (!user) {
                throw new customerror_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, `user with id ${id} not found`);
            }
            return user;
        });
    }
}
exports.UserServiceImpl = UserServiceImpl;
