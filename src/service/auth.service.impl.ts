// import { config } from "dotenv";
import { db } from "../config/db";
import { loginDTO } from "../dtos/login.dto";
import { CustomError } from "../error/customerror";
import { comparePassword } from "../error/password.utils";
import { AuthService } from "./auth.service";
import jwt from 'jsonwebtoken'
// import { JsonWebTokenError } from "jsonwebtoken";

export class AuthServiceImpl implements AuthService {
   async login(data: loginDTO): Promise<{ accessToken: string; refreshToken: string; }> {
    const user = await db.user.findFirst({
        where: {
            email: data.email
        },
    });
    if(!user) {
        throw new CustomError(401, "Invalid Password or Email")
    }

    const isPasswordValid = await comparePassword(data.password, user.password)
        if (!isPasswordValid) { 
            throw new CustomError(401, "Invalid Password or Email");
        }

        const fullname = user.firstName + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.id, fullname, user.role);

        const refreshToken = this.generateRefreshToken(
            user.id,
            fullname,
            user.role
        );

        return {accessToken, refreshToken}
    }

    generateAccessToken(userId: number, name:string, role:string):string {
        return jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        });
    }

    generateRefreshToken(userId: number, name:string, role:string):string {
        return jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || '', {
            expiresIn:process.env.JWT_REFRESH_EXPIRES_IN,
        });
    }

    generateOTPexpiration() {
        return new Date(Date.now() + 10 * 60 * 1000)
    }
}
   
   