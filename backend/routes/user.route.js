import express from "express";
import currentUser from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

let userRouter = express.Router();

userRouter.get("/current", isAuth, currentUser);

export default userRouter;
