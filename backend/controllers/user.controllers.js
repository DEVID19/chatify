import uploadOnCloudinary from "../config/cloudinary.js";
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
    const { fullName } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let editedUser = await User.findByIdAndUpdate(
      req.userId,
      {
       fullName,
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
