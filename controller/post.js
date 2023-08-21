const Posts = require("../models/posts");
const Users = require("../models/users");

module.exports.getexplore = (req, res) => {
  console.log(req.params)
  Posts.find({User_id:{$ne:req.params.id}})
    .populate("User_id")
    .then((posts) => {
      res.send(posts);
    });
};

module.exports.gethome = (req, res, next) => {
  Posts.find({User_id:{$ne:req.params.id}})
    .populate("User_id")
    .populate("comments.postedBy")
    .then((posts) => {
      res.send(posts);
    });
};

module.exports.getprofile = (req, res) => {
  const token = req.headers.authorization;
  // const detoken = jwt.verify(token, Jwt_secret)._id;
  Users.findById({ _id: token }).then((user) => {
    Posts.find({ User_id: token }).then((post) => {
      res.send([user, post]);
    });
  });
};

module.exports.getdeletepost = (req, res, next) => {
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
  const { id } = req.params;
  Posts.findOne({ _id: id })
    .populate("User_id")
    .then((post) => {
      // console.log(post);
      res.send({ post });
    });
};

module.exports.addcomment = (req, res) => {
  const token = req.headers.authorization;
  // const detoken = jwt.verify(token, Jwt_secret);
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
  const token = req.body.id;
  console.log(token);
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
