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
      res
        .status(201)
        .json({ success: true, message: "Message added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add message to the database" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};

module.exports.getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    const messages = await Messages.find({
      group: groupId,
    }).sort({ updatedAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get group messages" });
  }
};

module.exports.addGroupMessage = async (req, res, next) => {
  try {
    const { groupId, from, message } = req.body;
    const data = await Messages.create({
      text: message,
      group: groupId,
      senderId: from,
    });

    if (data) {
      res
        .status(201)
        .json({ success: true, message: "Message added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add message to the database" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add message" });
  }
};

module.exports.getGroup = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const groups = await Messages.find({
      users: userId,
    });

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get groups" });
  }
};

module.exports.addGroup = async (req, res, next) => {
  try {
    const { userId, group } = req.body;
    const data = await Messages.create({
      users: group,
      group: true,
    });

    if (data) {
      res
        .status(201)
        .json({ success: true, message: "Group added successfully." });
    } else {
      res.status(500).json({ error: "Failed to add group to the database" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add group" });
  }
};

module.exports.addUserGroup = async (req, res, next) => {
  try {
    const { userId, groupId } = req.body;
    const data = await Messages.findByIdAndUpdate(groupId, {
      $push: { users: userId },
    });

    if (data) {
      res
        .status(201)
        .json({ success: true, message: "User added to group successfully." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user to group" });
  }
};

module.exports.getUserGroup = async (req, res, next) => {
  try {
    const { groupId } = req.body;
    const group = await Messages.findById(groupId);

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get group" });
  }
};
