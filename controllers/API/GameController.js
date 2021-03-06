const { validationResult } = require("express-validator");
const { customAlphabet } = require("nanoid");
const Game = require("../../models/Game");
const Match = require("../../models/Match");
const Player = require("../../models/Player");
const { validationError } = require("../../util/errorResponse");
const { getRandomInt, randomIntFromInterval } = require("../../util/helpers");
const { maleNameGenerate, femaleNameGenerate, locationGenerate } = require("../../util/Facker");
const { response } = require("../../util/responseFormat");
const { collectXP } = require("../../util/XPCalculation");
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const nanoid = customAlphabet(alphabet, 10);

exports.gameAdd = (req, res, next) => {
  let gameData=[
    {
      name: "NineCard",
      gameUniqueId: 1001,
      winXP: 3,
      loseXP: 1,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Hazari",
      gameUniqueId: 1002,
      winXP: 8,
      loseXP: 4,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Chatai",
      gameUniqueId: 1004,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "GinRummy",
      gameUniqueId: 1006,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "TwentyNineCardGame",
      gameUniqueId: 1007,
      winXP: 20,
      loseXP: 5,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "CallBreak",
      gameUniqueId: 1008,
      winXP: 8,
      loseXP: 4,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "ClassicSolitaire",
      gameUniqueId: 1010,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "SevenOnSeven",
      gameUniqueId: 1013,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Hearts",
      gameUniqueId: 1014,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "CallBridge",
      gameUniqueId: 1015,
      winXP: 8,
      loseXP: 4,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "DoTeenPuch",
      gameUniqueId: 1023,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Rummy",
      gameUniqueId: 1027,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Poker",
      gameUniqueId: 1035,
      winXP: 6,
      loseXP: 1,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "BalckJack",
      gameUniqueId: 1037,
      winXP: 2,
      loseXP: 1,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "TeenPatti",
      gameUniqueId: 1044,
      winXP: 6,
      loseXP: 1,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "Spades",
      gameUniqueId: 1045,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "SpiderSolitaire",
      gameUniqueId: 1046,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
    {
      name: "CardMatch",
      gameUniqueId: 1047,
      winXP: 8,
      loseXP: 2,
      roundXP: 0.5,
      gameMode: [
        {
          modeName: "First",
          modeAmount: 500,
        },
      ]
    },
  ]
  Game.insertMany(gameData).then((result)=>{
    return response(res, false, 404, "No Games found", null);
  })
  .catch((err)=>{
    console.log(err);
  })
};
exports.getAllGames=(req,res,next)=>{
  Game.find()
  .then((games)=>{
    var data={
      games:games
    }
    response(res, true, 200, "All Games", data);
  })
  .catch((err)=>{
    const error = new Error(err);
    error.status = 500;
    return next(error);
  })
}
exports.gameStart=async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors);
  }
  let gameId = req.body.gameId;
  let totalPlayer = req.body.totalPlayer;
  let gameMode = req.body.gameMode;
  Game.findOne({ gameUniqueId: gameId })
    .then(async (game) => {
      if (!game) {
        return response(res, false, 404, "No Games found", null);
      }
      let gameModeInfo = game.gameMode.find(
        (mode) => mode.modeName === gameMode
      );
      if (typeof gameModeInfo === "undefined") {
        const error = new Error();
        error.status = 500;
        return next(error);
      }
      let tempMatchId = nanoid();
      while (await Match.findOne({ matchUniqueId: tempMatchId })) {
        tempMatchId = nanoid();
      }
      if(req.user.totalCoin<gameModeInfo.modeAmount){
        return response(res, false, 404, "Not enough coin", null);
      }
      let malePlayersCount=getRandomInt(totalPlayer)+1;
      let femalePlayersCount=totalPlayer-malePlayersCount;
      let malePlayers=maleNameGenerate(malePlayersCount);
      let femalePlayers=femaleNameGenerate(femalePlayersCount);
      let totalPlayers=malePlayers.concat(femalePlayers);

      let players=[]
      let tempPlayers=[]
      let picIndex=1;
      let gender="male";
      let level_min=parseInt(req.user.level/10);
      let level_max=level_min+10;
      for(var i=0;i<totalPlayers.length;i++){
        if((i+1)>=femalePlayersCount){
          gender="female"
          picIndex=getRandomInt(52)+1;
        }else{
          picIndex=getRandomInt(83)+1;
        }

        let level=randomIntFromInterval(level_min,level_max);
        let currentLevelXP=req.user.currentLevelXP;
        let totalCoin=req.user.totalCoin;
        let totalPlayedMatch=req.user.totalPlayedMatch;
        let totalWinMatch=req.user.totalWinMatch;
        let diffLevel=0;
        if(req.user.level>level){
           diffLevel=req.user.level-level;
        }else{
           diffLevel=level-req.user.level;
        }
        if(req.user.level==0){
          currentLevelXP=20;
          diffLevel=diffLevel-1;
        }
        if(level>req.user.level){
          
          for(var j=0;j<diffLevel-1;j++){
            currentLevelXP+=currentLevelXP*0.1;
          }
          totalWinMatch=randomIntFromInterval(totalWinMatch,totalPlayedMatch)
        } else if(level<req.user.level){
          for(var j=0;j<diffLevel-1;j++){
            currentLevelXP-=currentLevelXP*0.1;
          }

          if(totalPlayedMatch>10){
            totalPlayedMatch=randomIntFromInterval((totalPlayedMatch-10),totalPlayedMatch)
          }else{
            totalPlayedMatch=randomIntFromInterval(1,10)
          }
        }
        if(totalPlayedMatch<10){
          totalPlayedMatch=randomIntFromInterval((totalPlayedMatch+5),(totalPlayedMatch+10))
        }
        else{
          totalPlayedMatch=randomIntFromInterval((totalPlayedMatch-5),(totalPlayedMatch+5))
        }
        totalWinMatch=randomIntFromInterval(totalWinMatch,totalPlayedMatch)
        totalCoin=randomIntFromInterval((totalCoin+1000),(totalCoin+5000))
        currentLevelXP=Math.round(currentLevelXP);
        let location=locationGenerate();
        let tempPlayer={
          name:totalPlayers[i],
          country:location.country,
          city:location.city,
          pictureUrl: `https://ulka-profile-pics.s3.ap-south-1.amazonaws.com/${gender}/${gender}_image_${picIndex}.jpg`,
          totalPlayedMatch:totalPlayedMatch,
          totalWinMatch:totalWinMatch,
          currentXP:randomIntFromInterval(5,19),
          level:level,
          currentLevelXP:level===0?0:currentLevelXP,
          targetXP:level===0?20:Math.round(currentLevelXP+(currentLevelXP*0.1)),
          totalCoin:totalCoin
        }
       players.push(tempPlayer)
       delete tempPlayer.currentLevelXP;
       tempPlayer.avaterSelected=randomIntFromInterval(1,5)
       tempPlayer.frameSelected=randomIntFromInterval(1,5)
       tempPlayer.bannerSelected=randomIntFromInterval(1,5)
       tempPlayer.inventory=null
       tempPlayers.push(tempPlayer)
      }
      let match=new Match({
        matchUniqueId:tempMatchId,
        gameId:game._id,
        winXP:game.winXP,
        loseXP:game.loseXP,
        roundXP:game.roundXP,
        gameMatchCoin:gameModeInfo.modeAmount,
        gameModeName:gameModeInfo.modeName,
        players:players
      });

      req.user.totalCoin=req.user.totalCoin-gameModeInfo.modeAmount;
      req.user.save()
      .then((user)=>{
        match.save()
        .then((result)=>{
          var data={
            matchInfo:{
              matchId:result.matchUniqueId,
              gameId:result.gameId,
              gameMatchCoin:result.gameMatchCoin,
              matchWinCoin:gameCoinCollection(true,result.gameMatchCoin),
              players:tempPlayers
            }
          }
          response(res,true,200,"Game Start Data",data);
        })
        .catch((err) => {
          const error = new Error(err);
          error.status = 500;
          return next(error);
        });
      })
      .catch((err)=>{
        const error = new Error(err);
        error.status = 500;
        return next(error);
      })
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
}
exports.gameOver = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors);
  }
  let matchId = req.body.matchId;
  let position = req.body.position;
  let totalRound = req.body.totalRound;
  let winStatus = false;
  let player=req.user;
    Match.findOne({matchUniqueId:matchId})
    .then((match) => {
      if (!match) {
        return response(res, false, 404, "No Match found", null);
      }
      if (position == 1) {
        winStatus = true;
      }
      let getXPInfo = collectXP(match, player, winStatus, totalRound);
      let gameWinCoin=gameCoinCollection(winStatus,match.gameMatchCoin);
      let gamePlayInfo = gamePlayHistory(
        match.gameId,
        player,
        winStatus,
        match.gameModeName,
        match.totalPlayers,
        position,
        totalRound,
        gameWinCoin
      );
      const totalWinCoinIndex=player.totalWinCoin.findIndex(coin=>{
          return JSON.stringify( coin.gameId) === JSON.stringify(match.gameId);
      });
      let updatedTotalWinCoins=[...player.totalWinCoin];
      if (totalWinCoinIndex>=0)
      {
          newCoin = player.totalWinCoin[totalWinCoinIndex].coin+gameWinCoin;
          updatedTotalWinCoins[totalWinCoinIndex].gameId = match.gameId;
          updatedTotalWinCoins[totalWinCoinIndex].coin = newCoin;
          updatedTotalWinCoins[totalWinCoinIndex].lastWinTimeStamp =Date.now();
      }else{
        updatedTotalWinCoins.push({
              gameId:match.gameId,
              coin:gameWinCoin,
              lastWinTimeStamp:Date.now()
          });
      }
      console.log(updatedTotalWinCoins);
      player.level = getXPInfo.currentLevel;
      player.currentLevelXP = getXPInfo.currentLevelXP;
      player.currentXP = getXPInfo.currentXP;
      player.totalCoin = gamePlayInfo.currentTotalCoin;
      player.totalWinCoin=updatedTotalWinCoins;
      let playHistory = [...player.playHistory, gamePlayInfo.playHistory];
      player.playHistory = playHistory;
      player
        .save()
        .then((result) => {
          let data = {
            gameInfo: {
              name: result.name,
              fbId: result.fbId,
              userId: result.userId,
              pictureUrl: result.pictureUrl,
              totalCoin: result.totalCoin,
              currentXP: result.currentXP,
              targetXP: result.level==0?20:result.currentLevelXP + result.currentLevelXP * 0.1,
              level: result.level,
              totalWinMatch: result.totalWinMatch
            },
          };
          return response(res, false, 200, "Player Score Updated", data);
        })
        .catch((err) => {
          console.log(err)
          const error = new Error(err);
          error.status = 500;
          return next(error);
        });
    })
    .catch((err)=>{
      console.log(err)
      const error = new Error(err);
      error.status = 500;
      return next(error);
    })
  

  
};

let gameCoinCollection=(winStatus,mode_amount)=>{
  let currentMatchCoin =0;
  if (winStatus) {
    currentMatchCoin = mode_amount * 2;
  }
  return currentMatchCoin;
}
let gamePlayHistory = (
  gameId,
  player,
  winStatus,
  gameModeName,
  totalPlayer,
  position,
  totalRound,
  gameWinCoin
) => {
  let currentTotalCoin = player.totalCoin+gameWinCoin;
  return {
    currentTotalCoin: currentTotalCoin,
    playHistory: {
      gameId: gameId,
      position: position,
      gameMode: gameModeName,
      totalRound: totalRound,
      winStatus: winStatus,
      coin: gameWinCoin,
      totalPlayer: totalPlayer,
    },
  };
};
