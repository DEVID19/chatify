import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  deleteMessage,
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

MessageRouter.get("/get/:receiver", isAuth, getMessages);

MessageRouter.delete("/delete/:messageId", isAuth, deleteMessage);

export default MessageRouter;
