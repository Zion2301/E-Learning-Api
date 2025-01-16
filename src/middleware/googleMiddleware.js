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
exports.googlesignup = void 0;
const google_auth_library_1 = require("google-auth-library");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const myclient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID); //create and instance of the oauth smth using my google client id
const googlesignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token; //extract google id token from the frontnd
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Google token is needed" });
            return; //check if token is missing
        }
        const ticket = yield myclient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID //ensures the token is meant for my app by matching it with my application
        });
        const tokenpayload = ticket.getPayload(); //extracting payload from token(basically jus decoded data liek the actual emai, password and shi)
        if (!tokenpayload) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: "Invalid Google Token" }); //if there isnt any payload immediately terminate the process cos it can cause a security breach
            return;
        }
        const userexists = yield prisma.user.findUnique({
            where: {
                googleId: tokenpayload.sub
            } //the sub field is the unique identifier
        });
        if (userexists) {
            const jwtToken = jsonwebtoken_1.default.sign({ id: userexists.id, email: userexists.email }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
            req.user = userexists;
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: "User logged in successfully", userexists, token: jwtToken });
            return;
        }
        const googleId = tokenpayload === null || tokenpayload === void 0 ? void 0 : tokenpayload.sub;
        const email = tokenpayload.email;
        const firstname = tokenpayload.given_name;
        const lastname = tokenpayload.family_name;
        if (!googleId || !email || !firstname) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Google token missing required fields" });
            return; // Stop further execution if fields are missing
        }
        const newUser = yield prisma.user.create({
            data: {
                email: email,
                password: 'password', // Use a hashed password in production
                firstName: firstname,
                lastName: lastname,
                googleId: googleId, // Ensure this is included
                role: "USER",
            }
        }); //create a new user if they dont exist previously
        const jwtToken = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
        req.user = newUser; // Add user to request object for later middleware use
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "User signed up successfully", newUser, token: jwtToken });
        return;
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    } //if everythng fails, throw error
});
exports.googlesignup = googlesignup;
