const { check } = require("express-validator");
exports.playerValidate = [
  check("name")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.fb_id) {
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
  check("du_id").not().isEmpty().withMessage("Device id Required"),
  check("firebase_token")
    .not()
    .isEmpty()
    .withMessage("Firrbase Token Required"),
  check("picture_url").custom((value, { req }) => {
    if (req.body.fb_id) {
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
