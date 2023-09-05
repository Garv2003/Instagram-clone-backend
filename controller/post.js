const Posts = require("../models/posts");
const Users = require("../models/users");

module.exports.getexplore = (req, res) => {
  const { id } = req.params;
  
  if (id === "undefined") {
    return res.status(400).json({ message: "User is not logged in, please login" });
  }
  
  Posts.find({ User_id: { $ne: id } })
    .populate("User_id")
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
    return res.status(400).json({ message: "User is not logged in, please login" });
  }

  Posts.find({ User_id: { $ne: id } })
    .populate("User_id")
    .populate("comments.postedBy")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.getprofile = (req, res) => {
  const token = req.headers.authorization;
  
  if (token === "undefined") {
    return res.status(400).json({ message: "User is not logged in, please login" });
  }

  Users.findById(token)
    .populate("savedpost")
    .then((user) => {
      Posts.find({ User_id: token }).then((post) => {
        res.json([user, post]);
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.getdeletepost = (req, res) => {
  const { id } = req.params;

  if (id === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.json({ message: "true" });
      } else {
        res.json({ message: "false" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.postdeleteprofilepost = (req, res) => {
  const { id } = req.body;

  if (id === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Users.findByIdAndUpdate(id, {
    profileImage: "",
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.updatepost = (req, res) => {
  const { id } = req.params;

  if (id === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findByIdAndUpdate(id, {
    title: req.body.title,
    description: req.body.description,
    ImageUrl: req.body.ImageUrl,
  })
    .then((result) => {
      res.json({ message: "true" });
    })
    .catch((err) => {
      res.json({ message: "false" });
    });
};

module.exports.getshowpost = (req, res) => {
  const { id } = req.params;

  if (id === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findOne({ _id: id })
    .populate("User_id")
    .then((post) => {
      if (post) {
        res.status(200).json({ post });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.addcomment = (req, res) => {
  const token = req.headers.authorization;
  const { id } = req.body;

  if (token === "undefined" || id === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  const comment = {
    comment: req.body.text,
    postedBy: token,
  };

  Posts.findByIdAndUpdate(id, {
    $push: { comments: comment },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.postlike = (req, res) => {
  const { id, postid } = req.body;

  if (id === "undefined" || postid === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findByIdAndUpdate(postid, {
    $push: { likes: id },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.postunlike = (req, res) => {
  const { id, postid } = req.body;

  if (id === "undefined" || postid === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findByIdAndUpdate(postid, {
    $pull: { likes: id },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.savepost = (req, res) => {
  const { id, postid } = req.body;

  if (id === "undefined" || postid === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findByIdAndUpdate(postid, {
    $push: { bookmarks: id },
  })
    .then((result) => {
      Users.findByIdAndUpdate(id, {
        $push: { savedpost: postid },
      })
        .then((userResult) => {
          res.json(userResult);
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

module.exports.unsavepost = (req, res) => {
  const { id, postid } = req.body;

  if (id === "undefined" || postid === "undefined") {
    return res.status(400).json({ message: "Error occurred, please try again" });
  }

  Posts.findByIdAndUpdate(postid, {
    $pull: { bookmarks: id },
  })
    .then((result) => {
      Users.findByIdAndUpdate(id, {
        $pull: { savedpost: postid },
      })
        .then((userResult) => {
          res.json(userResult);
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};
