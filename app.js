const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const requestIp = require("request-ip");
const fs = require("fs");

const apiRoute = require("./routes/api");
const { getError } = require("./util/errorResponse");
const SocketSingleton = require("./util/SocketSingleton");

//setup express app
const app = express();
var http = require('http').Server(app);

SocketSingleton.configure(http);

const MONGO_CONFIG = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
};

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.use(requestIp.mw())
app.use(passport.initialize())
require('./passport')(passport)
//initialize routes
app.use("/api/",apiRoute);

app.use((req,res,next)=>{
    next({
        status: 404
    });
})
SocketSingleton.io.on("move", (data) => {
  switch (data) {
    case "left":
      position.x -= 5;
      SocketSingleton.io.emit("position", position);
      break;
    case "right":
      position.x += 5;
      SocketSingleton.io.emit("position", position);
      break;
    case "up":
      position.y -= 5;
      SocketSingleton.io.emit("position", position);
      break;
    case "down":
      position.y += 5;
      SocketSingleton.io.emit("position", position);
      break;
  }
});
//error handling middleware
app.use((error,req, res, next) => {
    console.log(error);
    fs.appendFile('error.log', JSON.stringify(error.message), function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    getError(error,req, res, next)
});

mongoose
  .connect(process.env.MONGODBURI, MONGO_CONFIG)
  .then((result) => {
    http.listen(process.env.PORT || 4000, () => {
        console.log(`Example app listening on ${process.env.PORT} port!`);
      });
  })
  .catch((err) => console.log(err));