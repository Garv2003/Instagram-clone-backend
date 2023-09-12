const express = require("express");
const router = express.Router();
const controller = require("../controller/post");
const controllerimage = require("../controller/image");
const imageupload = require("../middlewares/setupmulter");
const fetchuser = require("../middlewares/fetchuser");

// router.get("/explore/:id",controller.getexplore);
router.get("/profile", fetchuser, controller.getprofile);
router.delete("/deletepost/:id", fetchuser, controller.getdeletepost);
router.get("/showpost/:id", fetchuser, controller.getshowpost);

router.post("/deleteporfilephoto", fetchuser, controller.postdeleteprofilepost);
router.post("/updatepost/:id", fetchuser, controller.updatepost);

router.post(
  "/addpost",
  fetchuser,
  imageupload.uploadimage,
  controllerimage.getimage
);
router.post(
  "/addprofilephoto",
    fetchuser,
  imageupload.uploadimage,
  controllerimage.postprofile
);

router.post("/addcomment", fetchuser, controller.addcomment);
router.put("/like", fetchuser, controller.postlike);
router.put("/unlike", fetchuser, controller.postunlike);
router.get("/", fetchuser, controller.gethome);

router.put("/bookmark", fetchuser, controller.savepost);
router.put("/unbookmark", fetchuser, controller.unsavepost);

module.exports = router;
