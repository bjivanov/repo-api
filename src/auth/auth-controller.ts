import * as mongoose from 'mongoose';

import * as passport from 'passport';

const User = mongoose.model('User');

function prepareUserResponse(user) {
  return {
    id: user.id,
    username: user.username
  };
}

export function registerPost(req, res, next) {
  if (
    req.body.username &&
    req.body.password
  ) {
    var userData = {
      username: req.body.username,
      password: req.body.password,
    };
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        return res.json({ status: 'success' });
      }
    });
  }
}

export function loginPost(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid username or password.'
      });
    }

    (<any>req).login(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        status: 'success',
        data: prepareUserResponse(user)
      });
    });
  })(req, res, next);
}

export function logoutGet(req, res) {
  (<any>req).logout();
  res.json({ success: true })
}

export function userGet(req, res) {
  res.status(200).json(prepareUserResponse(req.user));
}