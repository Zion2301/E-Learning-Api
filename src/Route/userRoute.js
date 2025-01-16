"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controls/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController = new userController_1.UserController();
const userRouter = express_1.default.Router();
userRouter.post("/", userController.createUser);
userRouter.get("/", authMiddleware_1.authenticateUser, userController.getAllUsers);
userRouter.get("/:id", authMiddleware_1.authenticateUser, userController.getUserById);
userRouter.put("/:id", authMiddleware_1.authenticateUser, userController.updateUser);
userRouter.delete("/:id", authMiddleware_1.authenticateUser, userController.deleteUser);
exports.default = userRouter;
