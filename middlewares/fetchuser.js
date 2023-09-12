const jwt = require("jsonwebtoken");
const Jwt_secret = "mysecretkey";

const fetchuser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    res
      .status(401)
      .send({
        error: "Invalid Token! Please authenticate your id using a valid token",
      });
  }
  try {
    const data = jwt.verify(token, Jwt_secret);
    req.user = data._id;
    next();
  } catch {
    res
      .status(401)
      .send({
        error: "Invalid Token! Please authenticate your id using a valid token",
      });
  }
};

module.exports = fetchuser;
