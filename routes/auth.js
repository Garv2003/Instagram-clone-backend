const express = require("express");
const router = express.Router();
const controller = require("../controller/auth");

router.post("/register", controller.postregister);
router.post("/login",controller.postlogin);

module.exports = router;
