const { check } = require("express-validator");
exports.gameOverValidate = [
  check("matchId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Match Id Required"),
  check("position")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Position Required"),
  check("totalRound")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Round Required")
];
