import express from "express";
import { AuthController } from "../controls/auth.controller";

const authController = new AuthController();

const authRouter = express.Router();

authRouter.post("/", authController.login);

export default authRouter

