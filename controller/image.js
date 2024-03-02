const Posts = require("../models/post");
const Users = require("../models/user");
const cloudinary = require("cloudinary").v2;

// get buffer from file
// convert buffer to datauri (base64)
// upload datauri to cloudinary

module.exports.getimage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file" });

    const { caption, location, type } = req.body;
    const fileBuffer = req.file.buffer;
    const post_short_id = Math.random().toString(36).substring(2, 9);

    if (!fileBuffer) {
      return res.status(400).json({ message: "File buffer not found" });
    }

    const base64String = fileBuffer.toString("base64");

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            reject({ message: "Failed to upload file", error: error.message });
          } else {
            resolve(result);
          }
        })
        .end(Buffer.from(base64String, "base64"));
    });

    const user = await Users.findOne({ _id: req.user });

    const newpost = new Posts({
      caption,
      ImageUrl: uploadResponse.url,
      location,
      type,
      post_short_id: post_short_id,
      User_id: req.user,
    });

    await newpost.save();

    res.status(200).json({
      message: "Post created successfully",
      post: newpost,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
};

module.exports.postprofile = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file" });

    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png" &&
      req.file.mimetype !== "image/jpg " &&
      req.file.mimetype !== "image/webp"
    )
      return res
        .status(400)
        .json({ message: "Please upload a jpeg or png file" });

    const fileBuffer = req.file.buffer;
    const base64String = fileBuffer.toString("base64");

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (error, result) => {
          if (error) {
            reject({ message: "Failed to upload file", error: error.message });
          } else {
            resolve(result);
          }
        })
        .end(Buffer.from(base64String, "base64"));
    });

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
