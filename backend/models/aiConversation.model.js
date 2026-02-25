import mongoose from "mongoose";

// ── This schema stores the full AI chat history for each user ──
// Gemini requires a specific format to remember conversation context
// Each message has a "role" (who spoke) and "parts" (what was said)
// role: "user"  → message sent by the human user
// role: "model" → message sent by Gemini AI
// We store one document per user — if user chats again we
// load this history and append to it so AI remembers everything

const aiConversationSchema = new mongoose.Schema(
  {
    // which user this AI conversation belongs to
    // one user = one AI conversation document
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one conversation per user — no duplicates
    },

    // full chat history in Gemini's required format
    // this array grows every time user sends a message
    history: [
      {
        // "user" = human sent this, "model" = AI sent this
        role: {
          type: String,
          enum: ["user", "model"], // only these two values allowed
          required: true,
        },
        // Gemini requires parts array with text object inside
        // even though it looks complex, it always has just one item
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }, // createdAt and updatedAt auto added
);

const AiConversation = mongoose.model("AiConversation", aiConversationSchema);

export default AiConversation;
