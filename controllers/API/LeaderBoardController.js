const Player = require("../../models/Player")

exports.globalLeaderBoard=()=>{
    Player.find()
}