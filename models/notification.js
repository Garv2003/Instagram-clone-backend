const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  type: String,
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
