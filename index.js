const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const PORT = process.env.PORT || 3456;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.URL, credentials: true }));
app.use(morgan("dev"));
app.use(compression());
app.use(helmet());

const postrouter = require("./routes/post");
const authrouter = require("./routes/auth");
const userrouter = require("./routes/user");
const messageouter = require("./routes/message");

app.get("/", (req, res) => {
  try {
    res.send("for testing purpose");
  } catch (err) {
    console.log(err);
  }
});

app.use("/auth", authrouter);
app.use("/user", userrouter);
app.use("/post", postrouter);
app.use("/message", messageouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
