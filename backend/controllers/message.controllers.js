import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/Socket.js";

export const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      image,
      message,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Skip socket emit for self-chat — frontend handles it directly
    const isSelfMessage = sender.toString() === receiver.toString();

    if (!isSelfMessage) {
      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: `Unable to send message ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    // Return empty array instead of 400 — handles self-chat with no messages yet
    if (!conversation) {
      return res.status(200).json([]);
    }

    return res.status(200).json(conversation?.messages);
  } catch (error) {
    res.status(500).json({ message: `Unable to get the message ${error}` });
  }
};




export const deleteMessage = async (req, res) => {
  try {
    const senderId = req.userId; // from your isAuth middleware
    const { messageId } = req.params;

    // find the message first
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only the sender can delete
    if (message.sender.toString() !== senderId.toString()) {
      return res.status(401).json({ message: "Unauthorized — you can only delete your own messages" });
    }

    // remove message from its conversation
    await Conversation.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    // delete the message from DB
    await Message.findByIdAndDelete(messageId);

    // notify receiver in real time via socket
    // only if it's a direct message (receiver exists)
    if (message.receiver) {
      const receiverSocketId = getReceiverSocketId(message.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", messageId);
      }
    }

    return res.status(200).json({ message: "Message deleted", messageId });

  } catch (error) {
    res.status(500).json({ message: `Unable to delete message ${error}` });
  }
};