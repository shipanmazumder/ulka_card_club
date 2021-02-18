const express = require("express");
const { playerAuthentic,searchFriends } = require("../controllers/API/PlayerController");
const isAuth = require("../middleware/isAuth");
const {playerValidate} = require("../validator/playerValidator");
const SocketSingleton = require("../util/SocketSingleton");

const route = express.Router();
/* GET home page. */
route.get('/', function(req, res, next) {
    var position={
        x:100,
        y:100
      }
     SocketSingleton.io.emit("position",position)
    
    res.send("hello")
  });
  
// route.post("/player-authentic",playerAuthentic)
route.post("/player-authentic",playerValidate,playerAuthentic)
route.get("/search-friends",isAuth,searchFriends)
module.exports = route;
