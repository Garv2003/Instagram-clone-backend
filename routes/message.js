const express = require("express");
const router = express.Router();
const messagecontroller = require("../controller/message");

router.post("/getmessage", messagecontroller.getMessages);
router.post("/addmessage", messagecontroller.addMessage);
// router.post("/getgroupmessage", messagecontroller.getGroupMessages);
// router.post("/addgroupmessage", messagecontroller.addGroupMessage);
// router.post("/getgroup", messagecontroller.getGroup);
// router.post("/addgroup", messagecontroller.addGroup);
// router.post("/addusergroup", messagecontroller.addUserGroup);
// router.post("/getusergroup", messagecontroller.getUserGroup);

module.exports = router;
