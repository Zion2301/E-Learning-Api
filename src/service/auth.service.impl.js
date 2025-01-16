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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImpl = void 0;
// import { config } from "dotenv";
const db_1 = require("../config/db");
const customerror_1 = require("../error/customerror");
const password_utils_1 = require("../error/password.utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { JsonWebTokenError } from "jsonwebtoken";
class AuthServiceImpl {
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: {
                    email: data.email
                },
            });
            if (!user) {
                throw new customerror_1.CustomError(401, "Invalid Password or Email");
            }
            const isPasswordValid = yield (0, password_utils_1.comparePassword)(data.password, user.password);
            if (!isPasswordValid) {
                throw new customerror_1.CustomError(401, "Invalid Password or Email");
            }
            const fullname = user.firstName + " " + user.lastName;
            const accessToken = this.generateAccessToken(user.id, fullname, user.role);
            const refreshToken = this.generateRefreshToken(user.id, fullname, user.role);
            return { accessToken, refreshToken };
        });
    }
    generateAccessToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name, role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        });
    }
    generateRefreshToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name, role }, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        });
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
