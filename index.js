require("dotenv").config();
const express = require("express");
const connectDB = require("./connectDB");
const cryptoRoutes = require("./Routes/cryptoRoutes.js");
const { insertAllStats } = require("./Controllers/cryptoControllers.js");

const app = express();
app.use("/", cryptoRoutes);

// connecting to database
connectDB();
const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

insertAllStats();
