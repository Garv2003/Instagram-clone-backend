const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: process.env.FOLDER,
//   },
//   allowedFormats: ["jpg", "png", "jpeg", "gif", "mp4"],
// });

// function fileFilter(req, file, cb) {
//   let extName = file.originalname.split(".").pop().toLowerCase();
//   console.log(extName);
//   if (
//     extName === "jpg" ||
//     extName === "jpeg" ||
//     extName === "png" ||
//     extName === "mp4"
//   ) {
//     return cb(null, true);
//   }
//   cb(null, false);
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// module.exports = {
//   upload,
//   fileFilter,
// };

module.exports = upload;
