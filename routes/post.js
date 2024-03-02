const express = require("express");
const router = express.Router();
const controller = require("../controller/post");
const controllerimage = require("../controller/image");
const upload = require("../middlewares/setupmulter");
const fetchuser = require("../middlewares/fetchuser");

router.get("/explore", fetchuser, controller.getexplore);
router.get("/showpost/:id", fetchuser, controller.getshowpost);
router.get("/profile", fetchuser, controller.getprofile);
router.get("/", fetchuser, controller.gethome);
router.get("/reels", fetchuser, controller.getReels);

router.delete("/deletepost/:id", fetchuser, controller.getdeletepost);
router.delete(
  "/deleteprofilephoto",
  fetchuser,
  controller.postdeleteprofilepost
);

router.delete("/deletecomment", fetchuser, controller.deletecomment);

router.post("/updatepost/:id", fetchuser, controller.updatepost);

router.post(
  "/addpost",
  fetchuser,
  upload.single("file"),
  controllerimage.getimage
);

router.post(
  "/addprofilephoto",
  fetchuser,
  upload.single("ImageUrl"),
  controllerimage.postprofile
);

router.post("/addcomment", fetchuser, controller.addcomment);
router.put("/togglelike", fetchuser, controller.togglelike);
router.put("/togglebookmark", fetchuser, controller.togglesavepost);
router.put("/commentreply", fetchuser, controller.addreply);
router.put("/commenttogglelike", fetchuser, controller.commenttogglelike);

module.exports = router;
