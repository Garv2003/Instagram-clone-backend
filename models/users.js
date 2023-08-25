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
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  savedpost: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
});

module.exports = mongoose.model("Users", userSchema);
