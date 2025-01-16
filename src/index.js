"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = __importDefault(require("./Route/userRoute"));
const courseRoute_1 = __importDefault(require("./Route/courseRoute"));
const authRouter_1 = __importDefault(require("./Route/authRouter"));
const googleRouter_1 = __importDefault(require("./Route/googleRouter"));
const errorHandler_1 = require("./error/errorHandler");
dotenv_1.default.config();
const portEnv = process.env.PORT;
if (!portEnv) {
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}
const PORT = parseInt(portEnv, 10);
if (isNaN(PORT)) {
    console.error("Error: PORT is not a number in .env file");
    process.exit(1);
}
const app = (0, express_1.default)();
const corsOption = {
    origin: "*",
    credentials: true,
    allowedHeaders: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE"
};
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/course", courseRoute_1.default);
app.use("/api/v1/login", authRouter_1.default);
app.use("/api/v1/google", googleRouter_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
