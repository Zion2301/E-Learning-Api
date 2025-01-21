import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./Route/userRoute";
import courseRouter from "./Route/courseRoute"
import authRouter from "./Route/authRouter";
import { errorHandler } from "./error/errorHandler";
import { passport } from './middleware/passprtConfig';
import session from "express-session";
import { forgetPassword, verifyOTP, resetPassword } from "./controls/otpcontroller";



dotenv.config();
const portEnv = process.env.PORT;

if (!portEnv) {
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}

const PORT: number = parseInt(portEnv,10)
if (isNaN(PORT)) {
    console.error("Error: PORT is not a number in .env file")
    process.exit(1)
}

const app = express();
const corsOption = {
    origin:
    "*",
    credentials: true,
    allowedHeaders: "*",
    methods:"GET, HEAD, PUT, PATCH, POST, DELETE"
};

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default',  
    resave: false,             
    saveUninitialized: true,   
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24
     },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOption));

app.use(express.json());
// app.use(bodyParser.json()); 

app.use("/api/v1/users", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/login", authRouter)
app.post("/api/auth/forget-password", forgetPassword)
app.post("/api/auth/verify-otp", verifyOTP);
app.post("/api/auth/reset-password", resetPassword)
app.use(errorHandler)

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { session: true }),
  (req, res) => {
    res.json({
      message: 'Google login successful!',
      user: req.user,
    });
  }
);

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
});






