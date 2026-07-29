const mongoose = require("mongoose");
require("dotenv").config();

function connectDB() {
  mongoose

    .connect(process.env.MONGO_URI)

    .then(() => {
      console.log("MongoDB Connected");
    })

    .catch((err) => {
      console.error("MongoDB connection failed:", err);
      process.exit(1);
    });
}

module.exports = connectDB;
