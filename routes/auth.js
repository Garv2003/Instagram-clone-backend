const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");
const fetchuser = require("../middlewares/fetchuser");

router.post("/register", controller.postregister);
router.post("/login",controller.postlogin);
router.get("/user", fetchuser,controller.getuser);

module.exports = router;
