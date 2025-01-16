import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./Route/userRoute";
import courseRouter from "./Route/courseRoute"
import authRouter from "./Route/authRouter";
import googleRoute from "./Route/googleRouter";
import { errorHandler } from "./error/errorHandler";



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

app.use(cors(corsOption));

app.use(express.json());
app.use("/api/v1/users", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/login", authRouter)
app.use("/api/v1/google", googleRoute)
app.use(errorHandler)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
});






