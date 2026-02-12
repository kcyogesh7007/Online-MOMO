const express = require("express");
const app = express();
const connectDB = require("./database/database");
require("dotenv").config();
connectDB();

const authRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use("/api", productRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
