import { NextFunction, Request, Response } from "express";
import { AuthServiceImpl } from "../service/auth.service.impl";
import { loginDTO } from "../dtos/login.dto";

export class AuthController {
    private authService: AuthServiceImpl;

    constructor() {
        this.authService = new AuthServiceImpl()
    }

    public login = async (
        req: Request,
        res: Response,
        next:NextFunction
    ): Promise<void> => {
        try{
            const data: loginDTO = req.body;
            const {accessToken, refreshToken} = await this.authService.login(data);
            res.status(201).json({accessToken, refreshToken});
        } catch (error) {
            next(error)
        }
    }
}