const User = require("./model/userModel");
const bcrypt = require("bcryptjs");

const adminSeeder = async () => {
  const isAdminExist = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!isAdminExist) {
    await User.create({
      userEmail: "admin@gmail.com",
      userName: "admin",
      userPassword: bcrypt.hashSync("admin", 10),
      userPhoneNumber: 9845145236,
      role: "admin",
    });
    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already seeded");
  }
};

module.exports = adminSeeder;
