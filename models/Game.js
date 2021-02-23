const mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Game", gameSchema);
