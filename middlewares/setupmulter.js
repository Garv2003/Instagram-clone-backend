const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
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
module.exports.uploadimage = upload.single("ImageUrl"),
  (req, res, next) => {
    if (req.file) {
      next();
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  };
