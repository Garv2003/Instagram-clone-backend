const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  profileImage: String,
  Email: String,
  age: String,
  name: String,
  phonenumber: String,
  token: String,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedpost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
