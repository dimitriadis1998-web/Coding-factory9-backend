import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';
import { validateObjectId } from '../middlewares/validateObjectId.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole } from '../middlewares/user.middleware';

const router = Router();

/**
* @openapi
* /users:
*   get:
*     summary: Λίστα όλων των χρηστών
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Επιστρέφει array χρηστών
*/
router.get('/', authenticate, userCtrl.list);

/**
* @openapi
* /users/{id}:
*   get:
*     summary: Βρες χρήστη με βάση το ID
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Επιστρέφει τον χρήστη
*       404:
*         description: Ο χρήστης δεν βρέθηκε
*/
router.get('/:id', validateObjectId('id'), userCtrl.getOneById);
// router.get('/:id', authenticate, hasAdminRole, validateObjectId('id'), userCtrl.getOneById);

/**
* @openapi
* /users/email/{email}:
*   get:
*     summary: Βρες χρήστη με βάση το Email
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: email
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Επιστρέφει τον χρήστη
*       404:
*         description: Ο χρήστης δεν βρέθηκε
*/
router.get('/email/:email', userCtrl.getOneByEmail);
// router.get('/email/:email', authenticate, hasAdminRole, userCtrl.getOneByEmail);

/**
* @openapi
* /users:
*   post:
*     summary: Δημιουργία νέου χρήστη
*     tags: [Users]
*     security:
*       - bearerAuth: []
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
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*                 type: string
*     responses:
*       201:
*         description: Ο χρήστης δημιουργήθηκε
*/
// router.post('/', authenticate, hasAdminRole, validate(createUserSchema), userCtrl.create); // public
router.post('/', validate(createUserSchema), userCtrl.create); // public
/**
* @openapi
* /users/{username}:
*   put:
*     summary: Ενημέρωση χρήστη
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: username
*         required: true
*         schema:
*           type: string
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
*               firstname:
*                 type: string
*               lastname:
*                 type: string
*               email:
*     responses:
*       200:
*         description: Ο χρήστης ενημερώθηκε
*/
router.put('/:username', authenticate, hasAdminRole, validate(updateUserSchema), userCtrl.update);

/**
* @openapi
* /users/{username}:
*   delete:
*     summary: Διαγραφή χρήστη
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: username
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Ο χρήστης διαγράφηκε
*       404:
*         description: Ο χρήστης δεν βρέθηκε
*/
router.delete('/:username', authenticate, hasAdminRole, userCtrl.remove);

export default router;
