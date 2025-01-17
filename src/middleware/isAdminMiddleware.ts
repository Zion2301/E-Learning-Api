import { db } from "../config/db"
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../error/customerror";
import { StatusCodes } from "http-status-codes";
import { Role } from "@prisma/client";
import { CustomRequest } from "./authMiddleware";



const isAdmin = async (

    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: Number(req.userAuth),
            }
        });

        if(!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "User not found")
        }
        if(user.role === Role.ADMIN){
            next();
        } else {
            throw new CustomError(StatusCodes.FORBIDDEN, "Access Denied")
        }
    } catch (error) {
        next(error)
    }




}
export default isAdmin 
   