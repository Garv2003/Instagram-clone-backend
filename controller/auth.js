const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jwt_secret = "mysecretkey";

module.exports.postregister = async (req, res) => {
  if (
    !req.body.data.username ||
    !req.body.data.password ||
    !req.body.data.name ||
    !req.body.data.email
  ) {
    return res.send({ error: "Please enter all the fields" });
  }
  try {
    const { password } = req.body.data;
    const newUser = new Users({
      username: req.body.data.username,
      password: req.body.data.password,
      name: req.body.data.name,
      Email: req.body.data.email,
    });
    bcrypt.genSalt(10, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        newUser.password = hash;
        newUser.save();
        res.send({ message: "Registration successful" ,success:true});
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" ,success:false});
  }
};

module.exports.postlogin = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({ error: "Please enter all the fields" });
  }

  Users.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.send({ msg: "User Not Found", success: false });
      }
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const token = jwt.sign({ _id: user._id }, Jwt_secret,{  });
          const { _id, name, email, userName } = user;
          res.status(200).json({
            token,
            user: { _id, name, email, userName },
            msg: "Login successful",
            success: true,
          });
        } else {
          return res.send({ msg: "Invalid password", success: false });
        }
      });
    })
    .catch((err) => console.log(err));
};

module.exports.getuser = (req, res) => {
  const token = req.header("Authorization");
  try {
    const verified = jwt.verify(token, Jwt_secret);
    if (!verified) return res.send(false);
    Users.findById(verified._id)
      .populate("followers", "_id name username")
      .populate("following", "_id name username")
      .populate("savedpost", "_id name username profileImage")
      .select("-password")
      .then((user) => {
        res.send(user);
      });
  } catch (err) {
    res.send(false);
  }
};
