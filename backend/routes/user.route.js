import express from "express";
import {
  currentUser,
  editProfile,
  getOtherUsers,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

let userRouter = express.Router();

userRouter.get("/current", isAuth, currentUser);
userRouter.get("/others", isAuth, getOtherUsers);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);

export default userRouter;
