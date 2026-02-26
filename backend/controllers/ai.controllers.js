import { GoogleGenerativeAI } from "@google/generative-ai";
import AiConversation from "../models/aiConversation.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import axios from "axios";

// // ── Initialize Gemini with your API key from .env ──────────────
// // GoogleGenerativeAI is the main class from the package
// // we create one instance and reuse it for all requests
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ── Helper function — converts image URL to Base64 ────────────
// Gemini cannot visit URLs directly like a browser
// It needs the actual image data as a Base64 string
// This function downloads the image and converts it
const urlToBase64 = async (imageUrl) => {
  // download the image as raw binary data (arraybuffer)
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  // convert binary data to Base64 string
  const base64 = Buffer.from(response.data).toString("base64");

  // get the image type from response headers (image/jpeg, image/png etc)
  const mimeType = response.headers["content-type"];

  // return both — Gemini needs both to understand the image
  return { base64, mimeType };
};

// ── Main AI chat controller ────────────────────────────────────
export const chatWithAI = async (req, res) => {
  try {
    // ── Initialize Gemini with your API key from .env ──────────────
    // GoogleGenerativeAI is the main class from the package
    // we create one instance and reuse it for all requests
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // get logged in user id from isAuth middleware
    const userId = req.userId;

    // get the text message from request body (optional if image sent)
    const { message } = req.body;

    // check if user sent an image via multer (req.file set by multer)
    // req.file exists only if user attached an image
    let cloudinaryImageUrl = null;
    if (req.file) {
      // upload image to cloudinary using your existing function
      // this also deletes the local temp file automatically
      cloudinaryImageUrl = await uploadOnCloudinary(req.file.path);
    }

    // must have at least text or image — cannot send empty message
    if (!message && !cloudinaryImageUrl) {
      return res.status(400).json({ message: "Message or image is required" });
    }

    // ── Step 1: Find or create AI conversation for this user ──
    // findOne looks for existing conversation in DB
    // if not found we create a fresh one with empty history
    let aiConversation = await AiConversation.findOne({ userId });

    if (!aiConversation) {
      // first time this user is chatting with AI
      // create new document with empty history array
      aiConversation = await AiConversation.create({
        userId,
        history: [],
      });
    }

    // ── Step 2: Initialize Gemini model with chat history ─────
    // gemini-1.5-flash is fast and free tier
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",

      // systemInstruction gives AI its personality
      // this runs before every conversation — AI always remembers this
      systemInstruction: `
        You are Chatify AI, a friendly assistant inside a chat app called Chatify.
        You are fun, helpful, and conversational — like texting a friend.
        Keep responses short — max 3 sentences unless explanation is needed.
        If user sends an image, describe what you see and respond helpfully.
        Never say you are Google or Gemini — you are Chatify AI.
      `,
    });

    // startChat loads the full history so AI remembers previous messages
    // this is the key to making AI remember context across messages

    const chat = model.startChat({
      // clean _id fields added by MongoDB — Gemini rejects unknown fields
      history: aiConversation.history.map((h) => ({
        role: h.role,
        parts: h.parts.map((p) => ({ text: p.text })),
      })),
    });

    // ── Step 3: Build the message to send to Gemini ───────────
    // messageParts is an array because Gemini accepts
    // multiple parts in one message (text + image together)
    const messageParts = [];

    // add text part if user sent text
    if (message) {
      messageParts.push({ text: message });
    }

    // add image part if user sent image
    if (cloudinaryImageUrl) {
      // convert Cloudinary URL to Base64 — Gemini needs actual image data
      const { base64, mimeType } = await urlToBase64(cloudinaryImageUrl);

      // Gemini's required format for inline images
      messageParts.push({
        inlineData: {
          data: base64, // the actual image as Base64 string
          mimeType: mimeType, // tells Gemini what type of image it is
        },
      });
    }

    // ── Step 4: Send message to Gemini and get reply ──────────
    // sendMessage sends to Gemini with full history context loaded above
    const result = await chat.sendMessage(messageParts);
    const aiReply = result.response.text();

    // ── Step 5: Save both messages to DB history ──────────────
    // we save what USER said
    // if user sent image we save a note about it in text
    // because we cannot save Base64 in DB (too large)
    const userHistoryEntry = {
      role: "user",
      parts: [{ text: message || "sent an image" }],
    };

    // we save what AI replied
    const aiHistoryEntry = {
      role: "model",
      parts: [{ text: aiReply }],
    };

    // push both to history array and save to DB
    // next time user chats, AI will remember this conversation
    aiConversation.history.push(userHistoryEntry);
    aiConversation.history.push(aiHistoryEntry);
    await aiConversation.save();

    // ── Step 6: Return response to frontend ───────────────────
    // frontend needs the AI reply and the image URL
    // image URL is needed so frontend can display the image in chat
    return res.status(200).json({
      reply: aiReply,
      imageUrl: cloudinaryImageUrl, // null if no image was sent
    });
  } catch (error) {
    console.log("AI controller error:", error);
    res.status(500).json({ message: `AI error: ${error.message}` });
  }
};

// ── Get AI chat history for this user ─────────────────────────
// called when user opens AI chat — loads previous messages to show in UI
export const getAIHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const aiConversation = await AiConversation.findOne({ userId });

    // if no conversation exists yet return empty array
    if (!aiConversation) {
      return res.status(200).json([]);
    }

    // return history array so frontend can display old messages
    return res.status(200).json(aiConversation.history);
  } catch (error) {
    res.status(500).json({ message: `Unable to get AI history: ${error}` });
  }
};




export const clearAIHistory = async (req, res) => {
  try {
    const userId = req.userId;
    await AiConversation.findOneAndUpdate(
      { userId },
      { history: [] }
    );
    return res.status(200).json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: `Error clearing chat: ${error}` });
  }
};