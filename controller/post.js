const Posts = require("../models/posts");
const Users = require("../models/users");

module.exports.getexplore = (req, res) => {
  if (req.params.id == "undefined") {
    res.send("user is not logged in please login");
  }
  Posts.find({ User_id: { $ne: req.params.id } })
    .populate("User_id")
    .then((posts) => {
      res.send(posts);
    });
};

module.exports.gethome = (req, res, next) => {
  if (req.params.id == "undefined") {
    res.send("user is not logged in please login");
  }

  Posts.find({ User_id: { $ne: req.params.id } })
    .populate("User_id")
    .populate("comments.postedBy")
    .then((posts) => {
      res.send(posts);
    });
};

module.exports.getprofile = (req, res) => {
  const token = req.headers.authorization;
  // const detoken = jwt.verify(token, Jwt_secret)._id;
  if (token == "undefined") {
    res.send("user is not logged in please login");
  }

  Users.findById({ _id: token })
    .populate("savedpost")
    .then((user) => {
      Posts.find({ User_id: token }).then((post) => {
        res.send([user, post]);
      });
    });
};

module.exports.getdeletepost = (req, res, next) => {
  if (req.params.id == "undefined") {
    res.send("error occur please try again");
  }
  const { id } = req.params;
  Posts.deleteOne({ _id: id })
    .then((res) => {
      res.send(res);
    })
    .catch((err) => {
      res.send("False");
    });
};

module.exports.postdeleteprofilepost = (req, res) => {
  if (req.body.id == "undefined") {
    res.send("error occur please try again");
  }
  Users.findByIdAndUpdate(
    { _id: req.body.id },
    {
      profileImage: "",
    }
  ).then((d) => {
    res.send(d);
  });
};

module.exports.updatepost = (req, res) => {
  if (req.params.id == "undefined") {
    res.send("error occur please try again");
  }
  const { id } = req.params;
  Posts.findByIdAndUpdate(
    { _id: id },
    {
      title: req.body.title,
      description: req.body.description,
      ImageUrl: req.body.ImageUrl,
    }
  )
    .then((d) => {
      res.send("true");
    })
    .catch((err) => {
      res.send("false");
    });
};

module.exports.getshowpost = (req, res) => {
  if (req.params.id == "undefined") {
    res.send("error occur please try again");
  }
  const { id } = req.params;
  Posts.findOne({ _id: id })
    .populate("User_id")
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

module.exports.addcomment = (req, res) => {
  const token = req.headers.authorization;
  // const detoken = jwt.verify(token, Jwt_secret);
  if (token == "undefined" || req.body.id == "undefined") {
    res.send("error occur please try again");
  }
  let id = req.body.id;
  const comment = {
    comment: req.body.text,
    postedBy: token,
  };
  Posts.findByIdAndUpdate(
    { _id: id },
    {
      $push: { comments: comment },
    }
  ).then((d) => {
    res.send(d);
  });
};

module.exports.postlike = (req, res) => {
  if (req.body.id == "undefined" || req.body.postid == "undefined") {
    res.send("error occur please try again");
  }

  const token = req.body.id;
  const id = req.body.postid;
  if (id != undefined) {
    Posts.findByIdAndUpdate(
      { _id: id },
      {
        $push: { likes: token },
      }
    ).then((d) => {
      res.send(d);
    });
  }
};

module.exports.postunlike = (req, res) => {
  if (req.body.id == "undefined" || req.body.postid == "undefined") {
    res.send("error occur please try again");
  }

  const id = req.body.postid;
  const token = req.body.id;
  console.log(id);
  if (id != undefined) {
    Posts.findByIdAndUpdate(
      { _id: id },
      {
        $pull: { likes: token },
      }
    ).then((d) => {
      res.send(d);
    });
  }
};

module.exports.savepost = (req, res) => {
  if (req.body.id == "undefined" || req.body.postid == "undefined") {
    res.send("error occur please try again");
  }
  Posts.findByIdAndUpdate(
    { _id: req.body.postid },
    {
      $push: { bookmarks: req.body.id },
    }
  ).then((d) => {
    Users.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $push: { savedpost: req.body.postid },
      }
    ).then((d) => {
      res.send(d);
    });
  });
};

module.exports.unsavepost = (req, res) => {
  if (req.body.id == "undefined" || req.body.postid == "undefined") {
    res.send("error occur please try again");
  }

  Posts.findByIdAndUpdate(
    { _id: req.body.postid },
    {
      $pull: { bookmarks: req.body.id },
    }
  ).then((d) => {
    Users.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $pull: { savedpost: req.body.postid },
      }
    ).then((d) => {
      res.send(d);
    });
  });
};

