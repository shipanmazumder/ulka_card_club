const Game = require("../../models/Game");
const Match = require("../../models/Match");
const Player = require("../../models/Player");
const { response } = require("../../util/responseFormat");

exports.globalLeaderBoard = async (req, res, next) => {
  let gamePlayer = req.user;
  let gameId = req.body.gameId;
  Game.findOne({ gameUniqueId: gameId })
    .then((game) => {
      if (!game) {
        return response(res, false, 404, "No game found");
      }
      return Player.find({ "totalWinCoin.gameId": game._id })
        .sort({ "totalWinCoin.coin": -1, "totalWinCoin.lastWinTimeStamp": 1 })
        .limit(50)
        .then((players) => {
          var leaderboard = players.reduce(function (filtered, option, index) {
            let totalCoin = option.totalWinCoin.find((totalCoin) => {
              return (
                JSON.stringify(totalCoin.gameId) === JSON.stringify(game._id)
              );
            });
            var someNewValue = {
              position: index + 1,
              id: option._id,
              name: option.name,
              level: option.level,
              currentXP: option.currentXP,
              targetXP:
                option.level == 0
                  ? 20
                  : option.currentLevelXP +
                    Math.round(option.currentLevelXP * 0.1),
              coin: totalCoin.coin,
            };
            filtered.push(someNewValue);
            return filtered;
          }, []);
          return { leaderboard: leaderboard, game: game };
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((info) => {
      return Player.find({ "totalWinCoin.gameId": info.game._id })
        .sort({ "totalWinCoin.coin": -1, "totalWinCoin.lastWinTimeStamp": 1 })
        .then((players) => {
          const playerIndex = players.findIndex((player) => {
            return (
              JSON.stringify(player._id) === JSON.stringify(gamePlayer._id)
            );
          });
          if (playerIndex >= 0) {
            let myPosition = playerIndex + 1;
            let myFullInfo = players[playerIndex];
            let totalCoin = myFullInfo.totalWinCoin.find((totalCoin) => {
              return (
                JSON.stringify(totalCoin.gameId) ===
                JSON.stringify(info.game._id)
              );
            });
            var someNewValue = {
              position: myPosition,
              id: myFullInfo._id,
              name: myFullInfo.name,
              level: myFullInfo.level,
              currentXP: myFullInfo.currentXP,
              targetXP:
                myFullInfo.level == 0
                  ? 20
                  : myFullInfo.currentLevelXP +
                    Math.round(myFullInfo.currentLevelXP * 0.1),
              coin: totalCoin.coin,
            };
            return {
              leaderboard: info.leaderboard,
              myInfo: someNewValue,
              game: info.game,
            };
          } else {
            return { leaderboard: info.leaderboard, game: info.game,myInfo:null };
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((info) => {
        //friends leaderboard
      Player.findOne({ _id: gamePlayer._id })
        .populate({ path: "friends.friendId" })
        .sort({
          "friends.friendId.totalWinCoin.coin": -1,
          "friends.friendId.totalWinCoin.lastWinTimeStamp": 1,
        })
        .exec((err, player) => {
          if (err) {
            console.log(err);
          }
          //   console.log(player.friends)
          if (player.friends.length>0) {
            var leaderboard = player.friends.reduce(function (
              filtered,
              option
            ) {
              let totalCoin = option.friendId.totalWinCoin.find((totalCoin) => {
                return (
                  JSON.stringify(totalCoin.gameId) ===
                  JSON.stringify(info.game._id)
                );
              });
              if (totalCoin) {
                var someNewValue = {
                  id: option.friendId._id,
                  name: option.friendId.name,
                  level: option.friendId.level,
                  currentXP: option.friendId.currentXP,
                  targetXP:
                    option.friendId.level == 0
                      ? 20
                      : option.friendId.currentLevelXP +
                        Math.round(option.friendId.currentLevelXP * 0.1),
                  coin: totalCoin.coin,
                };
                filtered.push(someNewValue);
              }
              return filtered;
            },
            []);
            let myTotalCoin = player.totalWinCoin.find((totalCoin) => {
              return (
                JSON.stringify(totalCoin.gameId) ===
                JSON.stringify(info.game._id)
              );
            });
            if (myTotalCoin) {
              var myInfo = {
                id: player._id,
                name: player.name,
                level: player.level,
                currentXP: player.currentXP,
                targetXP:
                  player.level == 0
                    ? 20
                    : player.currentLevelXP +
                      Math.round(player.currentLevelXP * 0.1),
                coin: myTotalCoin.coin,
              };
              leaderboard.push(myInfo);
            }
            leaderboard.sort(
              firstBy(function (v1, v2) {
                return v2.coin - v1.coin;
              }).thenBy(function (v1, v2) {
                return v1.lastWinTimeStamp > v2.lastWinTimeStamp;
              })
            );
            let leaderboardMap = leaderboard.map((player, index) => {
              return {
                position: index + 1,
                id: player.id,
                name: player.name,
                level: player.level,
                currentXP: player.currentXP,
                targetXP: player.level,
                coin: player.coin,
              };
            });
            const playerIndex = leaderboardMap.findIndex((player) => {
              return (
                JSON.stringify(player.id) === JSON.stringify(gamePlayer._id)
              );
            });
            let myFullInfo=null;
            if (playerIndex >= 0) {
              myFullInfo= leaderboardMap[playerIndex];
            }
            var data={
                gloablLoaderBoard:{
                    leaderboard:info.leaderboard,
                    myInfo:info.myInfo
                },
                friendsLeaderBoard:{
                    leaderboard:leaderboardMap,
                    myInfo:myFullInfo
                }
            }
            response(res,true,200,"Global Leaderboards",data)
          }else{
            var data={
                gloablLoaderBoard:{
                    leaderboard:info.leaderboard,
                    myInfo:info.myInfo
                },
                friendsLeaderBoard:null
            }
            response(res,true,200,"Global Leaderboards",data)
          }
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

let firstBy = (function () {
  function e(f) {
    f.thenBy = t;
    return f;
  }
  function t(y, x) {
    x = this;
    return e(function (a, b) {
      return x(a, b) || y(a, b);
    });
  }
  return e;
})();
