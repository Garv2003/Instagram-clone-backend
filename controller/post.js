const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

function sendErrorResponse(res, message) {
  return res.status(400).json({ message });
}

function checkLoggedIn(req, res) {
  const token = req.headers.authorization;

  if (token === "undefined") {
    return sendErrorResponse(res, "User is not logged in, please login");
  }

  return token;
}

module.exports.getexplore = (req, res) => {
  const { id } = req.params;

  if (id === "undefined") {
    return res
      .status(400)
      .json({ message: "User is not logged in, please login" });
  }

  Post.find({ User_id: { $ne: id } })
    .populate("User_id")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.gethome = (req, res) => {
  const { id } = req.params;

  if (id === "undefined") {
    return res
      .status(400)
      .json({ message: "User is not logged in, please login" });
  }

  Post.find({ User_id: { $ne: id } })
    .populate("User_id")
    .sort({ createdAt: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.getprofile = async (req, res) => {
  const token = checkLoggedIn(req, res);

  try {
    const user = await User.findById(token).populate("savedpost");
    const post = await Post.find({ User_id: token });
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
  const { id } = req.body;

  try {
    const result = await User.findByIdAndUpdate(id, { profileImage: "" });
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
  const token = checkLoggedIn(req, res);
  console.log(req.body);
  try {
    const comment = await Comment.create({
      text: req.body.text,
      postedby: req.body.user_id,
    });
    console.log(comment);
    await Post.findByIdAndUpdate(req.body.postid, {
      $push: { comments: comment._id },
    });

    res.json({ message: "true" });
  } catch (err) {
    res.json({ message: "false" });
  }
};

module.exports.postlike = async (req, res) => {
  const { id, postid } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(postid, {
      $push: { likes: id },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.postunlike = async (req, res) => {
  const { id, postid } = req.body;

  try {
    const result = await Post.findByIdAndUpdate(postid, {
      $pull: { likes: id },
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.savepost = async (req, res) => {
  const { id, postid } = req.body;

  try {
    const postResult = await Post.findByIdAndUpdate(postid, {
      $push: { bookmarks: id },
    });

    const userResult = await User.findByIdAndUpdate(id, {
      $push: { savedpost: postid },
    });

    res.json(userResult);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.unsavepost = async (req, res) => {
  const { id, postid } = req.body;

  try {
    const postResult = await Post.findByIdAndUpdate(postid, {
      $pull: { bookmarks: id },
    });

    const userResult = await User.findByIdAndUpdate(id, {
      $pull: { savedpost: postid },
    });

    res.json(userResult);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
