import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
* @openapi
* /auth/register:
*   post:
*     summary: Εγγραφή νέου χρήστη
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*               password:
*                 type: string
*               email:
*                 type: string
*     responses:
*       201:
*         description: Ο χρήστης δημιουργήθηκε επιτυχώς
*       400:
*         description: Σφάλμα validation
*/
router.post('/register', validate(registerSchema), authCtrl.register);

/**
* @openapi
* /auth/login:
*   post:
*     summary: Σύνδεση χρήστη
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*               password:
*                 type: string
*     responses:
*       200:
*         description: Επιτυχής login - επιστρέφει JWT token
*       401:
*         description: Λάθος στοιχεία
*/
router.post('/login', validate(loginSchema), authCtrl.login);

/**
* @openapi
* /auth/me:
*   get:
*     summary: Επιστρέφει τον τρέχοντα χρήστη
*     tags: [Auth]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Ο authenticated χρήστης
*       401:
*         description: Δεν υπάρχει έγκυρο token
*/
router.get('/me', authenticate, authCtrl.me); // will be protected at app-level or use authenticate if desired


/**
* @openapi
* /auth/google:
*   post:
*     summary: Επιστρέφει jwt με google authentiacation
*     tags: [Auth]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Ο authenticated χρήστης
*       401:
*         description: Δεν υπάρχει έγκυρο token
*/
router.post('/google-auth', authCtrl.googleLogin); 

export default router;
