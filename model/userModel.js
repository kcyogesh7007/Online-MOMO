const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username must be provided"],
    },
    userEmail: {
      type: String,
      required: [true, "UserEmail must be provided"],
    },
    userPassword: {
      type: String,
      required: [true, "User password must be provided"],
    },
    userPhoneNumber: {
      type: String,
      required: [true, "User phoneNumber must be provided"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
