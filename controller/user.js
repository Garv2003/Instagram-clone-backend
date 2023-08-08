const Users = require("../models/users");
const Posts = require("../models/posts");

module.exports.getsuggestion = (req, res) => {
  Users.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports.showprofile = (req, res) => {
  const { id } = req.params;
  Users.findById({ _id: id }).then((user) => {
    Posts.find({ User_id: id })
      .then((post) => {
        res.send([user, post]);
      })
      .catch((err) => {
        res.send(err);
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
        res.send([result1, result2]);
      })
      .catch((err) => {
        return res.send(err);
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
        res.send([result1, result2]);
      })
      .catch((err) => {
        return res.send(err);
      });
  });
};

module.exports.getuser = (req, res, next) => {
  console.log(req.body);
  Users.find({
    $or: [
      { username:{ $regex: req.body.key, $options: 'i' }},
      { name: req.body.user },
    ],
  })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
