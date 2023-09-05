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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      text: message,
      users: [from, to],
      senderId: from,
    });

    if (data) {
      res.status(201).json({ success: true, message: "Message added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add message to the database" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};
