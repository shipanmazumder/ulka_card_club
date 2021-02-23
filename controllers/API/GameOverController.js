const { validationResult } = require("express-validator");
const Game = require("../../models/Game");
const Player = require("../../models/Player");
const { validationError } = require("../../util/errorResponse");
const { response } = require("../../util/responseFormat");
const { collectXP } = require("../../util/XPCalculation");

exports.gameAdd = (req, res, next) => {
  let game = new Game({
    name: "Teen Patti",
    game_unique_id: 1234,
    winXP: 6,
    loseXP: 1,
    roundXP: 0.5,
    gameMode: [
      {
        modeName: "First",
        modeAmount: 500,
      },
    ],
  });
  game.save();
  return response(res, false, 404, "No Games found", null);
};
exports.gameOver = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors);
  }
  let gameId = req.body.game_id;
  let position = req.body.position;
  let totalPlayer = req.body.total_player;
  let gameMode = req.body.game_mode;
  let totalRound = req.body.total_round;
  let winStatus = false;
  let userId = req.user.id;
  Game.findOne({ game_unique_id: gameId })
    .then((game) => {
      if (!game) {
        return response(res, false, 404, "No Games found", null);
      }
      Player.findOne({ _id: userId })
        .then((player) => {
          if (!player) {
            return response(res, false, 404, "No Player found", null);
          }
          if (position == 1) {
            winStatus = true;
          }

          let gameModeInfo = game.gameMode.find(
            (mode) => mode.modeName === gameMode
          );
          if (typeof gameModeInfo === "undefined") {
            const error = new Error();
            error.status = 500;
            return next(error);
          }
          let getXPInfo = collectXP(game, player, winStatus, totalRound);
          let gamePlayInfo = gameCoinCollection(
            game,
            player,
            winStatus,
            gameModeInfo,
            totalPlayer,
            position,
            totalRound
          );
          player.level = getXPInfo.currentLevel;
          player.currentLevelXP = getXPInfo.currentLevelXP;
          player.currentXP = getXPInfo.currentXP;
          player.totalCoin = gamePlayInfo.currentTotalCoin;
          let playHistory = [...player.playHistory, gamePlayInfo.playHistory];
          player.playHistory = playHistory;
          player
            .save()
            .then((result) => {
              let data = {
                player: result,
              };
              return response(res, false, 200, "Player Score Updated", data);
            })
            .catch((err) => {
              const error = new Error(err);
              error.status = 500;
              return next(error);
            });
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          error.status = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};
let gameCoinCollection = (
  game,
  player,
  winStatus,
  gameModeInfo,
  totalPlayer,
  position,
  totalRound
) => {
  let currentTotalCoin = player.totalCoin;
  let currentMatchCoin = gameModeInfo.modeAmount;
  if (winStatus) {
    currentTotalCoin = currentTotalCoin + currentMatchCoin * 2;
  }
  return {
    currentTotalCoin: currentTotalCoin,
    playHistory: {
      gameId: game._id,
      position: position,
      gameMode: gameModeInfo.modeName,
      totalRound: totalRound,
      winStatus: winStatus,
      coin: currentTotalCoin,
      totalPlayer: totalPlayer,
    },
  };
};
