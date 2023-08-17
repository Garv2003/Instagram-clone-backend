const express = require("express");
const router = express.Router();
const controller = require("../controller/user");

router.get("/suggestion", controller.getsuggestion);
router.get("/showprofile/:id", controller.showprofile);

router.put("/follow",controller.userfollow);
router.put("/unfollow",controller.userunfollow);

router.get("/search",controller.getuser);

module.exports = router;
