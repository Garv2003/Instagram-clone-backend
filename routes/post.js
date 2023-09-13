const express = require("express");
const router = express.Router();
const controller = require("../controller/post");
const controllerimage = require("../controller/image");
const { upload } = require("../middlewares/setupmulter");
const fetchuser = require("../middlewares/fetchuser");
const path = require("path");

router.get("/explore",fetchuser,controller.getexplore);

router.delete("/deletepost/:id", fetchuser, controller.getdeletepost);

router.delete(
  "/deleteprofilephoto",
  fetchuser,
  controller.postdeleteprofilepost
);

router.get("/showpost/:id", fetchuser, controller.getshowpost);
router.get("/profile", fetchuser, controller.getprofile);
router.post("/updatepost/:id", fetchuser, controller.updatepost);

router.post(
  "/addpost",
  fetchuser,
  upload.single("ImageUrl"),
  controllerimage.getimage
);

router.post(
  "/addprofilephoto",
  fetchuser,
  upload.single("ImageUrl"),
  controllerimage.postprofile
);

router.post("/addcomment", fetchuser, controller.addcomment);
router.put("/like", fetchuser, controller.postlike);
router.put("/unlike", fetchuser, controller.postunlike);
router.get("/", fetchuser, controller.gethome);

router.put("/bookmark", fetchuser, controller.savepost);
router.put("/unbookmark", fetchuser, controller.unsavepost);

module.exports = router;
