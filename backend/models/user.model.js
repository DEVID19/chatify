import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      required: true,
      unique: true,
      type: String,
      maxLength: 20,
      minLength: 2,
      trim: true,
    },
    email: {
      required: true,
      unique: true,
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid Email format",
      },
    },
    password: {
      required: true,
      type: String,
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 4,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password is not strong enough (4 chars, uppercase, lowercase, number, symbol required",
      },
    },
    image: {
      type: String,
      trim: true,
      default: "https://example.com/default-photo.jpg",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Invalid Url ",
      },
    },
    fullName: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 80,
    },
    status: {
      type: String,
      default: "Available",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

export default User;
