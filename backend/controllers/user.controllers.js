import User from "../models/user.model";

const currentUser = async (req, res) => {
  try {
    let userId = req.userId;

    const currentUserData = await User.findById({ userId }).select("-password");

    if (!currentUserData) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(currentUserData);
  } catch (error) {
    res.status(500).jsom({ message: `current user error ${error}` });
  }
};

export default currentUser;
