const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const fetchuser = require("../middlewares/fetchuser");

router.get("/suggestion", fetchuser, controller.getsuggestion);
router.get("/showprofile/:id", controller.showprofile);

router.put("/follow", fetchuser, controller.userfollow);
router.put("/unfollow", fetchuser, controller.userunfollow);
router.get("/search", controller.getuser);

module.exports = router;
