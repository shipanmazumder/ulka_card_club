const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Friends = new Schema({
  friendId: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  type: {
    type: String,
  },
  friendStatus: {
    type: Boolean,
  },
});
const playHistory = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    position: {
      type: Number,
    },
    totalPlayer:{
      type:Number
    },
    gameMode: {
      type: String,
    },
    totalRound: {
      type: Number,
    },
    winStatus: {
      type: Boolean,
    },
    coin: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    userId: {
      type: String,
      required: true,
    },
    loginId: {
      type: String,
      required: true,
    },
    fbId: {
      type: String,
    },
    duid: {
      type: String,
    },
    firebase_token: {
      type: String,
    },
    fb_access_token: {
      type: String,
    },
    pictureUrl: {
      type: String,
    },
    totalPlayedMatch: {
      type: Number,
      default:0
    },
    totalWinMatch: {
      type: Number,
      default:0
    },
    friends: [Friends],
    currentXP: {
      type: Number,
    },
    level: {
      type: Number,
      default:0
    },
    totalCoin: {
      type: Number,
      default:0
    },
    currentLevelXP: {
      type: Number,
      default:0
    },
    totalWinCoin:[
      {
        coin:{
          type:Number,
          default:0
        },
        gameId: {
          type: Schema.Types.ObjectId,
          ref: "Game",
        },
        lastWinTimeStamp:{
          type:Date,
          default: Date.now
        }
      }
    ],
    weeklyWinCoin:[
      {
        coin:{
          type:Number,
          default:0
        },
        gameId: {
          type: Schema.Types.ObjectId,
          ref: "Game",
        },
        lastWinTimeStamp:{
          type:Date,
          default: Date.now
        }
      }
    ],
    playHistory: [playHistory],
    location: {
      country: {
        type: String,
      },
      timezone: {
        type: String,
      },
      city: {
        type: String,
      },
      ll: {
        type: Array,
      },
    },
    challenges: [
      {
        friendId: {
          type: String,
          ref: "Player",
        },
      },
    ],
    deviceLog: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
playerSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.firebase_token;
  return obj;
};
module.exports = mongoose.model("Player", playerSchema);
