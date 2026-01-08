import express from "express";

const router = express.Router();

router.get("/send", (req, res) => {
  // Logic to send a message
  res.send("Message sent");
});

router.get("/history", (req, res) => {
  // Logic to get message history
  res.send("Message history");
});

export default router;
