import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/message.controllers.js";

let MessageRouter = express.Router();

MessageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendMessage,
);

MessageRouter.get("/send/:receiver", isAuth, getMessages);

export default MessageRouter;
