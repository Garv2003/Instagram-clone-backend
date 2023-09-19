const Posts = require("../models/post");
const Users = require("../models/user");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.getimage = async (req, res) => {
  try {
    const { title, description, type ,post_short_id } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(req.file.path);

    const user = await Users.findOne({ _id: req.user });

    const newpost = new Posts({
      title,
      ImageUrl: uploadResponse.url,
      description,
      type,
      post_short_id: post_short_id,
      User_id: req.user,
    });

    await newpost.save();

    res.status(200).json({
      title,
      ImageUrl: uploadResponse.url,
      description,
      post_short_id: post_short_id,
      User_id: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports.postprofile = async (req, res, next) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path);

    await Users.findByIdAndUpdate(
      { _id: req.user },
      {
        profileImage: uploadResponse.url,
      }
    );

    res.status(200).json(uploadResponse.url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};
