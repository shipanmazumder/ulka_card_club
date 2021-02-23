const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const gameMode=new Schema(
  {
    modeName:{
      type:String
    },
    modeAmount:{
      type:Number
    }
  }
);
const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    game_unique_id:{
        type:String,
        required:true
    },
    winXP:{
        type:Number
    },
    loseXP:{
        type:Number
    },
    roundXP:{
        type:Number
    },
    gameMode:[gameMode]
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Game", gameSchema);
