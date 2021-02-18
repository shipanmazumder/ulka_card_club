const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rewardSchema = new Schema(
  {
    coinAmount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
rewardSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
module.exports = mongoose.model("FirstReward", rewardSchema);
