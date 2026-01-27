import express from "express";
import currentUser from "../controllers/user.controllers";

let userRouter = express.Router();

userRouter.get("/currentUser", currentUser);

export default userRouter;
