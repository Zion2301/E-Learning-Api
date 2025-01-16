import { googlesignup } from "../middleware/googleMiddleware";
import express, { NextFunction, Response } from "express"
import { CustomRequest } from "../middleware/googleMiddleware";

const googleRoute = express.Router();

googleRoute.post("/google-signup", googlesignup);

export default googleRoute;
