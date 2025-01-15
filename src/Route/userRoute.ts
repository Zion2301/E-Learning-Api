import express from "express";
import { UserController } from "../controls/userController";
import { authenticateUser } from "../middleware/authMiddleware"

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", authenticateUser, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);

userRouter.put("/:id", authenticateUser, userController.updateUser)
userRouter.delete("/:id", authenticateUser, userController.deleteUser)

export default userRouter;