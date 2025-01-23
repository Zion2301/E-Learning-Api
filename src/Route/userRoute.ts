import express from "express";
import { UserController } from "../controls/userController";
import { authenticateUser } from "../middleware/authMiddleware"
import isAdmin from "../middleware/isAdminMiddleware";
import { uploadToCloudinaryProfileImage } from "../config/cloudinary.config";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/", authenticateUser, isAdmin, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);

userRouter.put("/:id", authenticateUser, userController.updateUser)
userRouter.delete("/:id", authenticateUser, userController.deleteUser)
userRouter.patch(
    "/profile-pic",
    authenticateUser, 
    uploadToCloudinaryProfileImage, 
    userController.updateProfilePic 
  );

export default userRouter;