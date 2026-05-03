import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authCtrl.register);
router.post('/login', validate(loginSchema), authCtrl.login);
router.post('/google-auth', authCtrl.googleLogin);
router.get('/me', authenticate, authCtrl.me);

export default router;