const mongoose = require("mongoose");
const { MONGODB_URI } = require("./env");

module.exports = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connection successfull");
};