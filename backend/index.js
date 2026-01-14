import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import connectDb from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on port ${port}`);
});
