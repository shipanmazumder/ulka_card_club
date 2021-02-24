const Player = require("../models/Player");
const { response } = require("./responseFormat");

exports.playerResponse =  (rew,res,next,id,onProcessDone) => {
    let data={};
  Player.findOne({ _id: id })
    .populate("friends.friendId")
    .populate("playHistory.gameId")
    .exec((err,player) => {
        if(err){
            const error = new Error(err);
            error.status = 500;
            return next(error);
        }
        if (!player) {
            return response(res, false, 404, "No Player found", null);
        }
      let friends = [];
      if (player.friends) {
        friends = player.friends.map((friend) => {
          return {
            name: friend.name,
            fbId: friend.fbId,
            userId: friend.userId,
          };
        });
      }
      let mostPlayedGames = [];
      if (player.playHistory) {
        let gameObject = {};
        player.playHistory.forEach(function (obj) {
            if(obj.gameId){
                gameObject[obj.gameId._id] = (gameObject[obj.gameId._id] || 0) + 1;
            }
        });
        let sortable = Object.keys(gameObject).sort(function (a, b) {
          return gameObject[b] - gameObject[a];
        });
        mostPlayedGames = sortable.slice(0, 3).map((obj) => {
          let game=player.playHistory.find((obj2) => {
            return JSON.stringify(obj2.gameId._id) === JSON.stringify(obj);
          });
          return {
              gameId:game.gameId.game_unique_id,
              name:game.gameId.name
          }
        });
      }
      data = {
        location: {
          country: player.location.country,
          city: player.location.city,
        },
        name: player.name,
        fbId: player.fbId,
        userId: player.userId,
        pictureUrl: player.pictureUrl,
        totalCoin: player.totalCoin,
        friends: friends,
        currentXP: player.currentXP,
        targetXP: player.level==0?20:player.currentLevelXP + player.currentLevelXP * 0.1,
        level: player.level,
        totalWinMatch: player.totalWinMatch,
        totalPlayedMatch: player.totalPlayedMatch,
        mostPlayedGames: mostPlayedGames,
        inventory: {
          avatars: {
            selected: 2,
            unlocked: [],
            locked: [],
          },
          frames: {
            selected: 3,
            unlocked: [],
            locked: [],
          },

          banners: {
            selected: 5,
            unlocked: [],
            locked: [],
          },
        },
      };
      onProcessDone(data)
    });
};
