const mongoose = require("mongoose");
const { Schema } = mongoose;

const postschema = new Schema({
  title: String,
  ImageUrl: String,
  description: String,
  User_id: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  comments: [
    {
      comment: { type: String },
      postedBy: { type: mongoose.Schema.Types.ObjectId ,ref:"Users"},
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", postschema);
