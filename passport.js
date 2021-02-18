const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const Player = require("./models/Player");

var privateKey = fs.readFileSync("./jwtRS256.key");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = privateKey;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (payload, done) => {
      Player.findOne({ _id: payload.data.id })
        .then((player) => {
          if (!player) {
            return done(null, false);
          } else {
            return done(null, player);
          }
        })
        .catch((error) => {
          return done(error);
        });
    })
  );
};
