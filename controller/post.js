const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Notification = require("../models/notification");

module.exports.getexplore = (req, res) => {
  Post.find({
    $and: [{ User_id: { $ne: req.user } }, { type: "image" }],
  })
    .select("ImageUrl likes comments type")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.getReels = async (req, res) => {
  const { skip, limit } = req.query;

  const total = await Post.find({
    $and: [{ User_id: { $ne: req.user } }, { type: "video" }],
  }).countDocuments();

  await Post.find({
    $and: [{ User_id: { $ne: req.user } }, { type: "video" }],
  })
    // .limit(limit)
    // .skip(skip)
    .populate("User_id", "-password -email")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.json({ posts: posts, total: total });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.gethome = async (req, res) => {
  const { skip, limit } = req.query;

  const total = await Post.find({
    User_id: { $ne: req.user },
    type: "image",
  }).countDocuments();

  await Post.find({
    $and: [{ User_id: { $ne: req.user } }, { type: "image" }],
  })
    .limit(limit)
    .skip(skip)
    .populate("User_id", "-password -email")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.json({ posts: posts, total: total });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.getprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .populate("savedpost")
      .select(
        "-password -email -followers -following -name -username -profileImage -createdAt -updatedAt -__v"
      );
    const post = await Post.find({
      $and: [{ User_id: req.user }, { type: "image" }],
    }).select("-User_id");
    const reels = await Post.find({
      $and: [{ User_id: req.user }, { type: "video" }],
    }).select("-User_id");

    res.json([user, post, reels]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getdeletepost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Post.deleteOne({ _id: id });

    const commit = await Comment.deleteMany({ postid: id });

    if (result.deletedCount === 1) {
      res.json({ message: "true" });
    } else {
      res.json({ message: "false" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postdeleteprofilepost = async (req, res) => {
  console.log(req.user);
  try {
    const result = await User.findByIdAndUpdate(req.user, { profileImage: "" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updatepost = async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      ImageUrl: req.body.ImageUrl,
    });
    res.json({ message: "true" });
  } catch (err) {
    res.json({ message: "false" });
  }
};

module.exports.getshowpost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({ _id: id })
      .populate("User_id")
      .populate({
        path: "comments",
        populate: {
          path: "postedby",
          select: "name profileImage username",
          model: "User",
        },
      });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.addcomment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      postedby: req.user,
    });
    await Post.findByIdAndUpdate(req.body.postid, {
      $push: { comments: comment._id },
    });
    const comment1 = await Comment.findById(comment._id).populate(
      "postedby",
      "name profileImage username"
    );
    const notification = new Notification({
      user: req.user,
      post: req.body.postid,
      type: "comment",
    });

    const savedNotification = await notification.save();

    await User.findByIdAndUpdate(
      req.body.postedby,
      { $push: { notifications: savedNotification._id } },
      { new: true }
    );

    res.json({ message: "true", comment: comment1 });
  } catch (err) {
    console.error(err);
    res.json({ message: "false" });
  }
};

module.exports.addreply = async (req, res) => {
  const { commentid, text } = req.body;

  try {
    const reply = await Comment.create({
      text: text,
      postedby: req.user,
    });
    Comment.findByIdAndUpdate(commentid, {
      $push: { replies: reply._id },
    });

    res.json({ message: "true", reply: reply });
  } catch (err) {
    res.json({ message: "false" });
  }
};

module.exports.commenttogglelike = async (req, res) => {
  const { commentid } = req.body;

  try {
    if (commentid === undefined) {
      return res.json({ message: "false" });
    }

    const result = await Comment.findById(commentid);

    if (result.likes.includes(req.user)) {
      const result = await Comment.findByIdAndUpdate(commentid, {
        $pull: { likes: req.user },
      });
      return res.json(result);
    } else {
      const result = await Comment.findByIdAndUpdate(commentid, {
        $push: { likes: req.user },
      });
      return res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.togglelike = async (req, res) => {
  const { postid } = req.body;

  try {
    const result = await Post.findById(postid);

    if (result.likes.includes(req.user)) {
      const result = await Post.findByIdAndUpdate(postid, {
        $pull: { likes: req.user },
      });

      const notification = await Notification.findOneAndDelete({
        user: req.user,
        post: postid,
        type: "like",
      });

      await User.findByIdAndUpdate(
        result.User_id,
        { $pull: { notifications: notification._id } },
        { new: true }
      );

      return res.json(result);
    } else {
      const result = await Post.findByIdAndUpdate(postid, {
        $push: { likes: req.user },
      });

      if (result.User_id !== req.user) {
        const notification = new Notification({
          user: req.user,
          post: postid,
          type: "like",
        });

        const savedNotification = await notification.save();

        await User.findByIdAndUpdate(
          result.User_id,
          { $push: { notifications: savedNotification._id } },
          { new: true }
        );
      }

      return res.json(result);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.togglesavepost = async (req, res) => {
  const { postid } = req.body;

  try {
    const postResult = await Post.findById(postid);

    if (postResult.bookmarks.includes(req.user)) {
      const postResult = await Post.findByIdAndUpdate(postid, {
        $pull: { bookmarks: req.user },
      });

      const userResult = await User.findByIdAndUpdate(req.user, {
        $pull: { savedpost: postid },
      });

      res.json(userResult);
    } else {
      const postResult = await Post.findByIdAndUpdate(postid, {
        $push: { bookmarks: req.user },
      });

      const userResult = await User.findByIdAndUpdate(req.user, {
        $push: { savedpost: postid },
      });

      res.json(userResult);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deletecomment = async (req, res) => {
  try {
    const result = await Comment.findByIdAndDelete(req.query.commentid);
    await Post.findByIdAndUpdate(req.query.postid, {
      $pull: { comments: req.query.commentid },
    });
    const notification = await Notification.findOneAndDelete({
      user: req.user,
      post: req.query.postid,
      type: "comment",
    });
    if (notification) {
      await User.findByIdAndUpdate(
        result.postedby,
        { $pull: { notifications: notification._id } },
        { new: true }
      );
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
