import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/Socket.js";

const MAX_GROUP_MEMBERS = 20;

// ─── Create Group ─────────────────────────────────────────────
export const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const parsedMembers = JSON.parse(members);
    const admin = req.userId;

    if (!groupName || !groupName.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!parsedMembers || parsedMembers.length < 2) {
      return res
        .status(400)
        .json({ message: "Select at least 2 members to create a group" });
    }

    // +1 because admin is also a participant
    if (parsedMembers.length > MAX_GROUP_MEMBERS - 1) {
      return res.status(400).json({
        message: `Group cannot exceed ${MAX_GROUP_MEMBERS} members including you`,
      });
    }

    let groupImage = "";
    if (req.file) {
      groupImage = await uploadOnCloudinary(req.file.path);
    }

    // Deduplicate — admin + selected members
    const participants = [...new Set([admin.toString(), ...parsedMembers])];

    const group = await Conversation.create({
      isGroup: true,
      groupName: groupName.trim(),
      groupImage,
      admin,
      participants,
      messages: [],
    });

    // Populate so frontend gets full user objects immediately
    const populatedGroup = await Conversation.findById(group._id)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify all selected members via socket in real time
    parsedMembers.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("addedToGroup", populatedGroup);
      }
    });

    return res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: `Unable to create group: ${error}` });
  }
};

// ─── Get My Groups ────────────────────────────────────────────
// Returns all groups the current user is part of
export const getMyGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await Conversation.find({
      isGroup: true,
      participants: { $in: [userId] },
    })
      .populate("participants", "-password")
      .populate("admin", "-password")
      .sort({ updatedAt: -1 }); // most recently active first

    return res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: `Unable to get groups: ${error}` });
  }
};

// ─── Send Group Message ───────────────────────────────────────
export const sendGroupMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { groupId } = req.params;
    const { message } = req.body;

    let image = "";
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const group = await Conversation.findById(groupId);

    if (!group || !group.isGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Security — only members can send messages
    const isMember = group.participants
      .map((p) => p.toString())
      .includes(sender.toString());

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    const newMessage = await Message.create({
      sender,
      receiver: null,
      conversationId: groupId,
      message,
      image,
    });

    group.messages.push(newMessage._id);
    // updatedAt changes — so getMyGroups sorts correctly on refresh
    await group.save();

    // Populate sender so frontend can show sender name + avatar
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "fullName username image",
    );

    // Emit to all group members except the sender
    group.participants.forEach((memberId) => {
      if (memberId.toString() !== sender.toString()) {
        const socketId = getReceiverSocketId(memberId.toString());
        if (socketId) {
          io.to(socketId).emit("newGroupMessage", {
            message: populatedMessage,
            groupId,
          });
        }
      }
    });

    return res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: `Unable to send group message: ${error}` });
  }
};

// ─── Get Group Messages ───────────────────────────────────────
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    const group = await Conversation.findById(groupId).populate({
      path: "messages",
      populate: {
        // Populate sender inside each message so UI shows name + avatar
        path: "sender",
        select: "fullName username image",
      },
    });

    if (!group) {
      return res.status(200).json([]);
    }

    // Security — only members can read
    const isMember = group.participants
      .map((p) => p.toString())
      .includes(userId.toString());

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    return res.status(200).json(group.messages);
  } catch (error) {
    res.status(500).json({ message: `Unable to get group messages: ${error}` });
  }
};

// ─── Add Member (admin only) ──────────────────────────────────
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const requesterId = req.userId;

    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== requesterId.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    if (group.participants.map((p) => p.toString()).includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    if (group.participants.length >= MAX_GROUP_MEMBERS) {
      return res.status(400).json({
        message: `Group is full — max ${MAX_GROUP_MEMBERS} members allowed`,
      });
    }

    group.participants.push(userId);
    await group.save();

    const updatedGroup = await Conversation.findById(groupId)
      .populate("participants", "-password")
      .populate("admin", "-password");

    // Notify new member via socket
    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      io.to(socketId).emit("addedToGroup", updatedGroup);
    }

    return res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: `Unable to add member: ${error}` });
  }
};

// ─── Remove Member / Leave Group ─────────────────────────────
export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const requesterId = req.userId;

    const group = await Conversation.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isAdmin = group.admin.toString() === requesterId.toString();
    const isSelf = userId === requesterId.toString();

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Not authorized" });
    }

    group.participants = group.participants.filter(
      (p) => p.toString() !== userId,
    );
    await group.save();

    return res.status(200).json({ message: "Removed successfully" });
  } catch (error) {
    res.status(500).json({ message: `Unable to remove member: ${error}` });
  }
};



// ─── Delete Group Message ─────────────────────────────────────
export const deleteGroupMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { messageId } = req.params;

    // find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only the sender can delete their own message
    if (message.sender.toString() !== senderId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized — you can only delete your own messages" });
    }

    // get the group to notify all members via socket
    const group = await Conversation.findById(message.conversationId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // remove message reference from group conversation
    await Conversation.updateOne(
      { _id: message.conversationId },
      { $pull: { messages: messageId } }
    );

    // delete the message from DB
    await Message.findByIdAndDelete(messageId);

    // notify ALL group members except sender in real time
    group.participants.forEach((memberId) => {
      if (memberId.toString() !== senderId.toString()) {
        const socketId = getReceiverSocketId(memberId.toString());
        if (socketId) {
          io.to(socketId).emit("groupMessageDeleted", {
            messageId,
            groupId: message.conversationId,
          });
        }
      }
    });

    return res.status(200).json({ message: "Message deleted", messageId });
  } catch (error) {
    res.status(500).json({ message: `Unable to delete group message: ${error}` });
  }
};