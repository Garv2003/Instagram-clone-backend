const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3456;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));

const postrouter=require('./routes/post');
const authrouter=require('./routes/auth')
const userrouter=require('./routes/user')

app.use('/auth',authrouter)
app.use('/user',userrouter)
app.use('/post',postrouter)

mongoose
  .connect("mongodb://127.0.0.1:27017/post")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:` + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
