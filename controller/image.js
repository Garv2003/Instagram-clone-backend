const Posts = require("../models/posts");
const Users = require("../models/users");
const cloudinary = require("cloudinary").v2;
const path = require("path");

module.exports.getimage = (req, res) => {
  const { title, description } = req.body;
  const token = req.headers.authorization;
  // const detoken = jwt.verify(token, Jwt_secret)._id;
  cloudinary.uploader.upload(`${req.file.path}`, async (error, result) => {
    await Users.findOne({ _id: token }).then((user) => {
      let newpost = new Posts({
        title,
        ImageUrl: result.url,
        description,
        User_id: token,
      });
      newpost
        .save()
        .then(() => {
          res.status(200).json({
            title,
            ImageUrl: result.url,
            description,
            User_id: {
              _id: user._id,
              username: user.username,
            },
          });
        })
        .catch((err) => {
          res.status(404).json(err);
        });
    });
  });
};

module.exports.postprofile = (req, res) => {
  const token = req.body.id;
  cloudinary.uploader.upload(`${req.file.path}`, (error, result) => {
    Users.findByIdAndUpdate(
      { _id: token },
      {
        profileImage: result.url,
      }
    )
      .then((re) => {
        res.status(200).json(result.url);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  });
};
