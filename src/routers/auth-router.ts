import * as express from 'express';
import { registerPost, loginPost, logoutGet, userGet } from '../auth/auth-controller';
import { checkAuth } from '../auth/check-auth';

const router = express.Router();

router.post('/register', registerPost);

router.post('/login', loginPost);

router.get('/logout', checkAuth, logoutGet);

router.get('/user', checkAuth, userGet);

export default router;