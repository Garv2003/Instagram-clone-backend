const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const fetchuser = require("../middlewares/fetchuser");

router.get("/suggestion", fetchuser, controller.getsuggestion);
router.get("/showprofile/:id", controller.showprofile);
router.get("/search", fetchuser, controller.getuser);
router.get("/notifications", fetchuser, controller.getNotification);

router.put("/follow", fetchuser, controller.userfollow);
router.put("/unfollow", fetchuser, controller.userunfollow);

module.exports = router;
