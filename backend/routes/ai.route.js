import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { chatWithAI, getAIHistory } from "../controllers/ai.controllers.js";

const aiRouter = express.Router();

// POST — send message to AI (text + optional image)
// multer handles image upload just like your message controller
aiRouter.post("/chat", isAuth, upload.single("image"), chatWithAI);

// GET — load previous AI chat history when user opens AI chat
aiRouter.get("/history", isAuth, getAIHistory);

export default aiRouter;