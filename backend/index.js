import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import connectDb from "./config/db.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
