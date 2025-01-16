import { Response, Request, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import {  StatusCodes } from "http-status-codes";
import  { User }  from "@prisma/client";
import { PrismaClient } from "@prisma/client";


export interface CustomRequest extends Request{
    user?: User
}
const prisma = new PrismaClient();
const myclient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); //create and instance of the oauth smth using my google client id
export const googlesignup = async(res: Response, req: CustomRequest, next: NextFunction): Promise<void> => {
    try {
        const token = req.body.token;  //extract google id token from the frontnd
    if (!token) {
        res.status(StatusCodes.BAD_REQUEST).json({message: "Google token is needed"}) 
        return //check if token is missing
    }

    const ticket = await myclient.verifyIdToken({ //verifying the token
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID  //ensures the token is meant for my app by matching it with my application

    })

    const tokenpayload = ticket.getPayload(); //extracting payload from token(basically jus decoded data liek the actual emai, password and shi)

    if (!tokenpayload) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid Google Token"}) //if there isnt any payload immediately terminate the process cos it can cause a security breach
        return
    }

    

    const userexists = await prisma.user.findUnique({
        where: {
            googleId: tokenpayload?.sub
        } //the sub field is the unique identifier
    })

    if (userexists) {
        req.user = userexists; //if the user exists, the user is attached to the req object, there fore making the user available for the next process
        return next() //passes the user on to the next function
    }

    const googleId = tokenpayload?.sub;
    const email = tokenpayload?.email
    const firstname = tokenpayload.given_name
    const lastname = tokenpayload.family_name

if (!googleId || !email || !firstname) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Google token missing required fields" });
    return; // Stop further execution if fields are missing
}

   
    const newUser = await prisma.user.create({
       data: {
        googleId: googleId,
        email: email,
        firstName: firstname,
        lastName: lastname,
        password: ''
       }
    }) //create a new user if they dont exist previously

    req.user = newUser;
    return next()
    } catch (error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }  //if everythng fails, throw error
}