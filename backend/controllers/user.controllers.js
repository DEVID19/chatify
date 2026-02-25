import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const currentUser = async (req, res) => {
  try {
    let userId = req.userId;

    const currentUserData = await User.findById(userId).select("-password");

    if (!currentUserData) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(currentUserData);
  } catch (error) {
    res.status(500).json({ message: `current user error ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { fullName, status } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let editedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName,
        status,
        image,
      },
      { new: true },
    );
    if (!editedUser) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(editedUser);
  } catch (error) {
    res.status(500).json({ message: `Unable to edit the profile ${error}` });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Fetch self separately to pin at top
    const selfUser = await User.findById(currentUserId).select("-password");

    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    const usersWithLastMessage = await Promise.all(
      otherUsers.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessageAt: lastMessage?.createdAt || null,
          isSelf: false,
        };
      }),
    );

    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) return 0;
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    // Build self entry — pinned at top always
    const selfEntry = {
      ...selfUser.toObject(),
      isSelf: true,
      lastMessageAt: null,
    };

    return res.status(200).json([selfEntry, ...usersWithLastMessage]);
  } catch (error) {
    res.status(500).json({ message: `Unable to get other users ${error}` });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required " });
    }
    let users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Unable to search users${error}` });
  }
};
