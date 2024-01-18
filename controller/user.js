const Users = require("../models/user");
const Posts = require("../models/post");
const Notification = require("../models/notification");

module.exports.getsuggestion = (req, res) => {
  Users.find({ _id: { $ne: req.user } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

module.exports.showprofile = async (req, res) => {
  if (!req.params.id) {
    res.send("User is not logged in, please login");
  }
  const { id } = req.params;

  try {
    const user = await Users.findById({ _id: id }).select("-password");

    const post = await Posts.find({
      $and: [{ User_id: id }, { type: "image" }],
    });
    const reels = await Posts.find({
      $and: [{ User_id: id }, { type: "video" }],
    });

    res.status(200).json([user, post, reels]);
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports.userfollow = async (req, res) => {
  try {
    const updatedFollowedUser = await Users.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );
    const updatedCurrentUser = await Users.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );
    const notification = new Notification({
      user: req.user,
      type: "follow",
    });
    const savedNotification = await notification.save();
    await Users.findByIdAndUpdate(
      req.body.followId,
      { $push: { notifications: savedNotification._id } },
      { new: true }
    );

    res.status(200).json({
      followedUser: updatedFollowedUser,
      currentUser: updatedCurrentUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.userunfollow = async (req, res) => {
  try {
    const updatedFollowedUser = await Users.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user } },
      { new: true }
    );
    const updatedCurrentUser = await Users.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followId } },
      { new: true }
    );
    const notification = await Notification.findOneAndDelete({
      user: req.user,
      type: "follow",
    });

    if (notification) {
      await Users.findByIdAndUpdate(
        req.body.followId,
        { $pull: { notifications: notification._id } },
        { new: true }
      );
    }

    res.status(200).json({
      followedUser: updatedFollowedUser,
      currentUser: updatedCurrentUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getuser = (req, res, next) => {
  if (!req.query.user) {
    return res.status(404).json([]);
  }
  Users.find({
    $and: [
      { username: { $regex: req.query.user } },
      { _id: { $ne: req.user } },
    ],
  })
    .select("_id name username profileImage followers")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

module.exports.getNotification = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user)
      .select("notifications")
      .populate({
        path: "notifications",
        populate: {
          path: "user",
          select: "username profileImage name",
        },
      });

    const fourteenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);
    const notificationsToDelete = await Notification.find({
      user: req.user,
      createdAt: { $lt: fourteenDaysAgo },
    });

    await Notification.deleteMany({
      user: req.user,
      createdAt: { $lt: fourteenDaysAgo },
    });

    const deletedNotificationIds = notificationsToDelete.map(
      (notification) => notification._id
    );
    user.notifications = user.notifications.filter(
      (id) => !deletedNotificationIds.includes(id)
    );

    await user.save();

    console.log(user.notifications);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Not Found" });
  }
};
