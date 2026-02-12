const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        message: "Please login",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
