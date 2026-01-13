import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 4,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "Password is not strong enough (4 chars, uppercase, lowercase, number, symbol required)."
      );
    }

    const exsistingUserName = await User.findOne({ username });
    if (exsistingUserName) {
      throw new Error("Username is already exist");
    }
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      throw new Error("Email already exist");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: passwordHash,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: false,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
