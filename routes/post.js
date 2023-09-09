const express = require("express");
const router = express.Router();
const controller = require("../controller/post");
const controllerimage=require("../controller/image");
const imageupload = require("../middlewares/setupmulter");

router.get("/explore/:id",controller.getexplore);
router.get("/profile", controller.getprofile);
router.get("/deletepost/:id",controller.getdeletepost);
router.get("/showpost/:id",controller.getshowpost);

router.post("/deleteporfilephoto", controller.postdeleteprofilepost);
router.post("/updatepost/:id", controller.updatepost);

router.post("/addpost",imageupload.uploadimage,controllerimage.getimage);
router.post("/addprofilephoto",imageupload.uploadimage,controllerimage.postprofile);

router.post("/addcomment", controller.addcomment);
router.put("/like",controller.postlike);
router.put("/unlike",controller.postunlike);
router.get("/:id", controller.gethome);

router.put("/bookmark", controller.savepost);
router.put("/unbookmark", controller.unsavepost);

module.exports = router;
