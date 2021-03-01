const { check } = require("express-validator");
exports.gameStartValidate = [
  check("gameId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Game Id Required"),
  check("gameMode")
    .not()
    .isEmpty()
    .withMessage("Game Mode Required"),
  check("totalPlayer")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Player Required"),
];
