const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const geoipLite = require("geoip-lite");
const FirstReward = require("../../models/FirstReward");
const Player = require("../../models/Player");

const { validationResult } = require("express-validator");
const { validationError } = require("../../util/errorResponse");
const { response } = require("../../util/responseFormat");
const { customAlphabet } = require("nanoid");
const alphabet = "0123456789";
const nanoid = customAlphabet(alphabet, 12);
const { v4: uuidv4 } = require("uuid");
const SocketSingleton = require("../../util/SocketSingleton");

/**
 * player update or create and also authentic
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.playerAuthentic = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors);
  }
  let loginId = "";
  let name = req.body.name;
  let fbId = req.body.fb_id;
  let duId = req.body.du_id;
  if (!fbId) {
    Player.findOne({ loginId: duId })
      .then(async (player) => {
        if (player) {
          name = player.name;
          loginId = player.loginId;
        } else {
          let tempName = `Guest_${nanoid()}`;
          while (await Player.findOne({ name: tempName })) {
            tempName = `Guest_${nanoid()}`;
          }
          name = tempName;
          loginId = duId;
        }
        playerUpdateOrCreate(name, fbId, duId, loginId, req, res, next);
      })
      .catch((err) => {
        const error = new Error(err);
        error.status = 500;
        return next(error);
      });
  } else {
    Player.findOne({ loginId: fbId })
      .then((player) => {
        if (player) {
          //if previous login with facebook
          loginId = fbId;
          playerUpdateOrCreate(name, fbId, duId, loginId, req, res, next);
        } else {
          Player.findOne({ loginId: duId })
            .then((gPlayer) => {
              if (gPlayer) {
                //if previous login with device id but now convert with fb id
                loginId = duId;
              } else {
                //new login with facebook
                loginId = fbId;
              }
              playerUpdateOrCreate(name, fbId, duId, loginId, req, res, next);
            })
            .catch((gerror) => {
              const error = new Error(gerror);
              error.status = 500;
              return next(error);
            });
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.status = 500;
        return next(error);
      });
  }
};
exports.searchFriends = (req, res, next) => {
  let name = req.query.name;
  console.log(req.user.loginId);
  Player.find({
    name: { $regex: name, $options: "i" },
    _id: { $ne: req.user._id },
    fbid: { $ne: "" },
  })
    .limit(5)
    .exec()
    .then((friends) => {
      if (friends.length <= 0) {
        return response(res, false, 404, "No firends found", null);
      }

      var data = {
        friends: friends,
      };
      response(res, true, 200, "Friends List", data);
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};
exports.friendRequest = () => {};
/**
 * player update or create
 * @param {*} name
 * @param {*} fbId
 * @param {*} duId
 * @param {*} loginId
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const playerUpdateOrCreate = async (
  name,
  fbId,
  duId,
  loginId,
  req,
  res,
  next
) => {
  let firebase_token = req.body.firebase_token;
  let pictureUrl = req.body.picture_url;
  let friends = req.body.friends;
  let ip = req.clientIp;
  if (process.env.APP_ENV == "development") {
    ip = "103.4.145.2";
  }
  let friendsMap = [];
  if (friends.length > 0) {
    for (var i = 0; i < friends.length; i++) {
      let fbFriend = await Player.findOne({ fbId: friends[i] });
      if (fbFriend) {
        friendsMap.push({
          friendId: fbFriend._id,
          type: "FB",
          friendStatus: true,
        });
      }
    }
  }
  Player.findOne({ loginId: loginId })
    .then(async (player) => {
      if (player) {
        if (fbId) {
          loginId = fbId;
        }
        const oldGameFirends = player.friends.filter(
          (friend) => friend.type === "GAME"
        );
        friendsMap = [...friendsMap, ...oldGameFirends];
        if (player.duId !== duId) {
          let deviceLogs = player.deviceLog.filter(
            (deviceLog) => deviceLog !== duId
          );
          deviceLogs = [...deviceLogs, duId];
          player.deviceLog = deviceLogs;
        }
        player.name = name;
        player.fbId = fbId;
        player.pictureUrl = pictureUrl;
        player.friends = friendsMap;
        player.loginId = loginId;
        player.duId = duId;
        player.save();
        var token = generateJwtToken(player);

        var data = {
          isNewPlayer: false,
          token: token,
          player: player,
        };
        var socketMessage = {
          message: "New Device Login",
          data: player,
        };
        SocketSingleton.io.emit(`login_${player.loginId}`, socketMessage);
        response(res, true, 200, "Player Update Successfull", data);
      } else {
        const firstReward = await FirstReward.findOne().sort("_id");
        var geoLocation = geoipLite.lookup(ip);
        const location = {
          country: geoLocation.country,
          timezone: geoLocation.timezone,
          city: geoLocation.city,
          ll: geoLocation.ll,
        };
        player = new Player({
          name: name,
          fbId: fbId,
          duId: duId,
          loginId: loginId,
          userId: uuidv4(),
          firebase_token: firebase_token,
          pictureUrl: pictureUrl,
          totalCoin: firstReward.coinAmount,
          friends: friendsMap,
          location: location,
          challenges: [],
          currentXP: 0,
          currentLevelXP: 0,
          deviceLog: [duId],
          level: 0,
        });
        player
          .save()
          .then((result) => {
            var token = generateJwtToken(result);
            var data = {
              isNewPlayer: true,
              token: token,
              player: result,
            };
            var socketMessage = {
              message: "New Device Login",
              data: player,
            };
            SocketSingleton.io.emit(`login_${player.loginId}`, socketMessage);
            response(res, true, 200, "Player Add Successfull", data);
          })
          .catch((err) => {
            const error = new Error(err);
            error.status = 500;
            return next(error);
          });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 500;
      return next(error);
    });
};
/**
 * generate jwt token for login auth
 * @param {*} player
 * @return jwt token
 */
const generateJwtToken = (player) => {
  var privateKey = fs.readFileSync("./jwtRS256.key");
  var token = jsonwebtoken.sign(
    {
      data: {
        name: player.name,
        id: player._id,
        fbId: player.fbId,
        loginId: player.loginId,
      },
    },
    privateKey,
    {
      // algorithm: "RS256",
      expiresIn: 60 * 60,
    }
  );
  return `Bearer ${token}`;
};

