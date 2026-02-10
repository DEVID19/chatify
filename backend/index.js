import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import connectDb from "./config/db.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import MessageRouter from "./routes/message.route.js";
import { app, server } from "./socket/Socket.js";

// import { app, server } from "./socket/socket.js"

dotenv.config();
const port = process.env.PORT || 8000;

app.use(
  cors({
   // origin: "http://localhost:5173",
    origin: "https://chatify-nos7.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", MessageRouter);

server.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
