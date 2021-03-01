const { check } = require("express-validator");
exports.playerValidate = [
  check("name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.fbId) {
        if(value=="")
        {
          throw new Error("Name is required");
        } else if (value.length < 3) {
          throw new Error("Name at least 3 digit");
        } else if (value.length > 24) {
          throw new Error("Name at max 24 digit");
        }else{
          return true;
        }
      }else{
        return true;
      }
    }),
  check("duId").not().isEmpty().withMessage("Device id Required"),
  check("firebaseToken")
    .not()
    .isEmpty()
    .withMessage("Firrbase Token Required"),
  check("pictureUrl").custom((value, { req }) => {
    if (req.body.fbId) {
      if(value===""){
        throw new Error("Picture is required");
      }else{
        return true;
      }
    }else{
      return true
    }
  }),
];
