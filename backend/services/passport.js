const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/UserModel');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(
    (user) => done(null, user),
    (error) => done(error),
  );
});

passport.use(
  new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
    User.findOne({ username: username.toLowerCase() })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'NO_USER' });
        }
        bcrypt.compare(password, user.hashedPassword, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'WRONG_PASSWORD' });
          }
        });
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  }),
);

module.exports = passport;
