const { check } = require("express-validator");
exports.gameOverValidate = [
  check("match_id")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Match Id Required"),
  check("position")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Position Required"),
  check("total_round")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Total Round Required")
];
