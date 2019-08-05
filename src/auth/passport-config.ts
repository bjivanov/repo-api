import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as mongoose from 'mongoose';

const User = mongoose.model('User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({
    _id: id
  }, '-password -salt', function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (!user.validatePassword(password)) {
        return done(null, false);
      }

      return done(null, user);
    });
  }
));