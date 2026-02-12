const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    adminSeeder();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
