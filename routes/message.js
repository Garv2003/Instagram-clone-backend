const express = require("express");
const router = express.Router();
const messagecontroller = require("../controller/message");

router.post("/addmessage",messagecontroller.addMessage);
router.get("/getmessage",messagecontroller.getMessages);

module.exports = router;