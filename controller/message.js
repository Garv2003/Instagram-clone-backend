const Messages = require("../models/message");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    res.json(messages);
    // const projectedMessages = messages.map((msg) => {
    //   return {
    //     fromSelf: msg.sender.toString() === from,
    //     message: msg.message.text,
    //   };
    // });
    // res.json(projectedMessages);
  } catch (err) {
    console.log(err);
    res.json({ msg: "Failed to get messages" });
  }
};

module.exports.addMessage = async (req, res, next) => {
  // try {
  const { from, to, message } = req.body;
  const data = await Messages.create({
    text: message,
    users: [from, to],
    senderId: from,
  });

  if (data) return res.json({ msg: "Message added successfully." });
  else return res.json({ msg: "Failed to add message to the database" });
};
