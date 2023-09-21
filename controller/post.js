const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const router = require("../routes/post");

module.exports.getexplore = (req, res) => {
  Post.find({ User_id: { $ne: req.user } })
    .populate("User_id")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.gethome = async (req, res) => {
  const { skip, limit } = req.query;

  const total = await Post.find({
    User_id: { $ne: req.user },
  }).countDocuments();

  await Post.find({ User_id: { $ne: req.user } })
    .limit(limit)
    .skip(skip)
    .populate("User_id")
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
    const user = await User.findById(req.user).populate("savedpost");
    const post = await Post.find({ User_id: req.user });
    res.json([user, post]);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getdeletepost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Post.deleteOne({ _id: id });

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

module.exports.commentlike = async (req, res) => {
  const { commentid } = req.body;
  Comment.findByIdAndUpdate(commentid, {
    $push: { likes: req.user },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: "false" });
    });
};

module.exports.commentunlike = async (req, res) => {
  const { commentid } = req.body;
  Comment.findByIdAndUpdate(commentid, {
    $pull: { likes: req.user },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json({ message: "false" });
    });
};

module.exports.postlike = async (req, res) => {
  const { postid } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(postid, {
      $push: { likes: req.user },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postunlike = async (req, res) => {
  const { postid } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(postid, {
      $pull: { likes: req.user },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.savepost = async (req, res) => {
  const { postid } = req.body;

  try {
    const postResult = await Post.findByIdAndUpdate(postid, {
      $push: { bookmarks: req.user },
    });

    const userResult = await User.findByIdAndUpdate(req.user, {
      $push: { savedpost: postid },
    });

    res.json(userResult);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.unsavepost = async (req, res) => {
  const { postid } = req.body;

  try {
    const postResult = await Post.findByIdAndUpdate(postid, {
      $pull: { bookmarks: req.user },
    });

    const userResult = await User.findByIdAndUpdate(req.user, {
      $pull: { savedpost: postid },
    });

    res.json(userResult);
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
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
