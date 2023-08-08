const path = require("path");
const express = require("express");
const router = express.Router();
const controller = require("../controller/post");
const Posts = require("../models/posts");
const Users = require("../models/users");

router.get("/explore",controller.getexplore);

router.get("/", controller.gethome);

router.get("/profile", controller.getprofile);

router.get("/deletepost/:id",controller.getdeletepost);

router.post("/deleteporfilephoto", controller.postdeleteprofilepost);

router.post("/updatepost/:id", controller.updatepost);

router.get("/showpost/:id",controller.getshowpost);

router.put("/addcomment", controller.addcomment);

router.put("/like",controller.postlike);

router.put("/unlike",controller.postunlike);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.FOLDER,
  },
});

function fileFilter(req, file, cb) {
  let extName = path.extname(file.originalname);
  if (extName === ".jpg" || extName === ".jpeg" || extName === ".png")
    return cb(null, true);
  cb(null, false);
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
router.use(upload.single("ImageUrl"));

router.post("/addpost", (req, res) => {
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
          res.send({
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
          res.send(err);
        });
    });
  });
});

router.post("/addprofilephoto", (req, res) => {
  const token = req.body.id;
  cloudinary.uploader.upload(`${req.file.path}`, (error, result) => {
    Users.findByIdAndUpdate(
      { _id: token },
      {
        profileImage: result.url,
      }
    )
      .then((re) => {
        res.send(re);
      })
      .catch((err) => {
        res.render(err);
      });
  });
});

module.exports = router;
