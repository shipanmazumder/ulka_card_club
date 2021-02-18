const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Friends = new Schema({
  friendId: {
    type: String,
    ref: "Player",
  },
  type:{
    type:String
  },
  friendStatus:{
    type:Boolean
  }
});
const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    loginId:{
      type: String,
      required: true,
    },
    fbId: {
      type: String
    },
    duid: {
      type: String,
    },
    firebase_token: {
      type: String,
    },
    pictureUrl: {
      type: String,
    },
    totalPlayedMatch:{
      type:Number
    },
    totalWinMatch:{
      type:Number
    },
    xpDifference:{
      type:Number
    },
    friends: [Friends],
    xp: {
      type: Number,
    },
    level: {
      type: Number,
    },
    coin: {
      type: Number,
    },
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
    challenges: [{
      friendId:{
        type:String,
        ref: "Player"
      }
    }],
    deviceLog:{
      type:Array
    }
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
