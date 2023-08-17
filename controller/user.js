const Users = require("../models/users");
const Posts = require("../models/posts");

module.exports.getsuggestion = (req, res) => {
  Users.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

module.exports.showprofile = (req, res) => {
  const { id } = req.params;
  Users.findById({ _id: id }).then((user) => {
    Posts.find({ User_id: id })
      .then((post) => {
        res.status(200).json([user, post]);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  });
};

module.exports.userfollow = (req, res) => {
  const token = req.body.token;
  Users.findByIdAndUpdate(
    { _id: req.body.followId },
    {
      $push: { followers: token },
    }
  ).then((result1) => {
    Users.findByIdAndUpdate(
      { _id: token },
      {
        $push: { following: req.body.followId },
      }
    )
      .then((result2) => {
        res.status(200).json([result1, result2]);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  });
};

module.exports.userunfollow = (req, res) => {
  const token = req.body.token;
  Users.findByIdAndUpdate(
    { _id: req.body.followId },
    {
      $pull: { followers: token },
    }
  ).then((result1) => {
    Users.findByIdAndUpdate(
      { _id: token },
      {
        $pull: { following: req.body.followId },
      }
    )
      .then((result2) => {
        res.status(200).json([result1, result2]);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  });
};

module.exports.getuser = (req, res, next) => {
  Users.find({username:{ $regex: req.query.user, $options: 'i' }})
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
