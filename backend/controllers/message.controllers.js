import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

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
      conversation = await conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
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
    }).populate("message");

    if (!conversation) {
      return res.status(400).json({ message: "conversation not found " });
    }

    return res.status(200).json(conversation?.messages);
  } catch (error) {
    res.status(500).json({ message: `Unable to get the message ${error}` });
  }
};
