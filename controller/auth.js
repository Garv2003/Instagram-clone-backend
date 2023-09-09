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
        res.send([{ message: "Registration successful" }, newUser]);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

module.exports.postlogin = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    return res.send({ error: "Please enter all the fields" });
  }

  Users.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.send({ error: "Invalid email" });
      }
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const token = jwt.sign({ _id: user._id }, Jwt_secret);
          const { _id, name, email, userName } = user;
          res.send({ token, user: { _id, name, email, userName } });

          console.log({ token, user: { _id, name, email, userName } });
        } else {
          return res.send({ error: "Invalid password" });
        }
      });
    })
    .catch((err) => console.log(err));
};
