import express from "express";
import {
  createGroup,
  getMyGroups,
  sendGroupMessage,
  getGroupMessages,
  addMember,
  removeMember,
  deleteGroupMessage,
} from "../controllers/group.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const groupRouter = express.Router();

groupRouter.post("/create", isAuth, upload.single("groupImage"), createGroup);
groupRouter.get("/my-groups", isAuth, getMyGroups);
groupRouter.post(
  "/send/:groupId",
  isAuth,
  upload.single("image"),
  sendGroupMessage,
);
groupRouter.get("/messages/:groupId", isAuth, getGroupMessages);
groupRouter.put("/add-member/:groupId", isAuth, addMember);
groupRouter.put("/remove-member/:groupId", isAuth, removeMember);
groupRouter.delete("/delete/:messageId", isAuth, deleteGroupMessage);
export default groupRouter;
