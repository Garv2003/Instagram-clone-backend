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
    const { title, description } = req.body;
    const token = req.headers.authorization;

    const uploadResponse = await cloudinary.uploader.upload(req.file.path);

    const user = await Users.findOne({ _id: token });

    const newpost = new Posts({
      title,
      ImageUrl: uploadResponse.url,
      description,
      User_id: token,
    });

    await newpost.save();

    res.status(200).json({
      title,
      ImageUrl: uploadResponse.url,
      description,
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

module.exports.postprofile = async (req, res) => {
  try {
    const token = req.body.id;

    const uploadResponse = await cloudinary.uploader.upload(req.file.path);

    await Users.findByIdAndUpdate(
      { _id: token },
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