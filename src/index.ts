import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as errorHandler from 'errorhandler';
import * as mongoose from 'mongoose';

import { ALLOW_ORIGIN, MONGODB_CONNECTION } from './utils/constants';
import { checkAuth } from './auth/check-auth';

mongoose.connect(MONGODB_CONNECTION);

const app = express();

app.use(cors({
  credentials: true, origin: ALLOW_ORIGIN
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'repo-viewer-auth', cookie: { httpOnly: true, maxAge: 1000 * 3600 }, resave: false, saveUninitialized: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler())
}
app.use(passport.initialize());
app.use(passport.session());

require('./auth/user-model');
require('./auth/passport-config');

import reposRouter from './routers/repos-router';
import authRouter from './routers/auth-router';

app.use('/auth', authRouter);
app.use('/repos', checkAuth, reposRouter);

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: err,
    },
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
});