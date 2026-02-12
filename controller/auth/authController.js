const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  const { email, password, userName, phoneNumber } = req.body;
  if (!email || !password || !userName || !phoneNumber) {
    return res.status(400).json({
      message: "Please provide email,userName,password and phone Number",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (userExist) {
    return res.status(400).json({
      message: "User with that email address already exists",
    });
  }
  await User.create({
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
    userName,
    userPhoneNumber: phoneNumber,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email address doesnot exist",
    });
  }
  const isPasswordMatch = bcrypt.compareSync(password, userExist.userPassword);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.status(200).json({
    message: "User loggedIn successfully",
    token,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email address doesnot exist",
    });
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  userExist.otp = otp;
  await userExist.save();
  await sendEmail({
    email,
    subject: "Your One Time Password for Online MOMO:",
    message: `Your otp for Online MOMO is ${otp}. Don't share with anyone.`,
  });
  res.status(200).json({
    message: "OTP sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please enter email and otp",
    });
  }
  const userExist = await User.findOne({
    userEmail: email,
  });
  if (!userExist) {
    return res.status(400).json({
      message: "User doesnot exist with that email address",
    });
  }
  if (userExist.otp !== otp) {
    return res.status(400).json({
      message: "Incorrect Otp",
    });
  }
  userExist.isOtpVerified = true;
  userExist.otp = undefined;
  await userExist.save();
  res.status(200).json({
    message: "OTP verified successfully",
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,newpassword and confirmPassword",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User doesnot exist with that email address",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Newpassword and confirmPassword doesnot match",
    });
  }
  if (!userExist.isOtpVerified) {
    return res.status(400).json({
      message: "You dont have permission to change password",
    });
  }
  userExist.userPassword = bcrypt.hashSync(newPassword, 10);
  userExist.isOtpVerified = false;
  await userExist.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
