const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Player = new Schema({
  name: {
    type: String,
  },
  location: {
    country: {
      type: String,
    },
    city: {
      type: String,
    },
  },
  pictureUrl: {
    type: String,
  },
  totalPlayedMatch: {
    type: Number,
    default: 0,
  },
  totalWinMatch: {
    type: Number,
    default: 0,
  },
  currentXP: {
    type: Number,
  },
  level: {
    type: Number,
    default: 0,
  },
  totalCoin: {
    type: Number,
    default: 0,
  },
  currentLevelXP: {
    type: Number,
    default: 0,
  },
  targetXP: {
    type: Number,
    default: 0,
  }
});
const matchSchema = new Schema(
  {
    matchUniqueId: {
      type: String,
      required: true,
    },
    totalPlayers: {
      type: Number,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    winXP: {
      type: Number,
    },
    loseXP: {
      type: Number,
    },
    roundXP: {
      type: Number,
    },
    gameModeName:{
      type:String
    },
    gameMatchCoin: {
      type: Number,
    },
    players:[Player]
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Match", matchSchema);
