const express = require("express");
const { playerAuthentic,searchFriends, playerInfo, otherPlayerInfo } = require("../controllers/API/PlayerController");
const isAuth = require("../middleware/isAuth");
const {playerValidate} = require("../validator/playerValidator");
const SocketSingleton = require("../util/SocketSingleton");
const { gameOverValidate } = require("../validator/gameOverValidate");
const { gameOver, gameAdd, gameStart, getAllGames } = require("../controllers/API/GameController");
const Player = require("../models/Player");
const { gameStartValidate } = require("../validator/gameStartValidate.js");
const { globalLeaderBoard } = require("../controllers/API/LeaderBoardController");

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
route.get("/player-info",isAuth,playerInfo)
route.get("/other-player-info",isAuth,otherPlayerInfo)
route.get("/search-friends",isAuth,searchFriends)
route.get("/all-games",isAuth,getAllGames)
route.post("/game-start",gameStartValidate ,isAuth,gameStart)
route.post("/game-over",gameOverValidate,isAuth,gameOver)
route.post("/game-add",isAuth,gameAdd)
route.get("/leaderboard",isAuth,globalLeaderBoard)
route.get("/test",async (req,res,next)=>{
  try {
    let player=await Player.find();
    res.send(player)
    } catch (error) {
        
    }
})
module.exports = route;
