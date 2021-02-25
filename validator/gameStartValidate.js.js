const { check } = require("express-validator");
exports.gameStartValidate = [
  check("game_id")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Game Id Required"),
  check("game_mode")
    .not()
    .isEmpty()
    .withMessage("Game Mode Required"),
  check("total_player")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Player Required"),
];
