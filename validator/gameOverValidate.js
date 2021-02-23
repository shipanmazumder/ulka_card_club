const { check } = require("express-validator");
exports.gameOverValidate = [
  check("game_id")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Game Id Required"),
  check("position")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Position Required"),
  check("game_mode")
    .not()
    .isEmpty()
    .withMessage("Game Mode Required"),
  check("total_round")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Round Required"),
  check("total_player")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Player Required"),
];
