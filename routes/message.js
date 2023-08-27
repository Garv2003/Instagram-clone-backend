const express = require("express");
const router = express.Router();
const messagecontroller = require("../controller/message");

router.post("/getmessage",messagecontroller.getMessages);
router.post("/addmessage",messagecontroller.addMessage);

module.exports = router;