/**
 * user Routes
 * @module
 */

import express from 'express';
import {
	confirm,
	login,
	signUp,
	forgotPassword,
	checkToken,
	newPassword,
	profile,
} from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';
import User from '../models/Users.js';

const router = express.Router();

router.get('/', async (req, res) => {
	const users = await User.findOne({ name: 'Carlos' });

	res.json(users);
});

/**
 * is for sign up in the app
 * @name signUp
 * @path {post} /api/users
 */
router.post('/', signUp);

/**
 * is for user login
 * @name login
 * @path {post} /api/users/login
 */
router.post('/login', login);

/**
 * is for confirm user with the token
 * @name confirm user
 * @path {get} /api/users/confirm/:token
 */
router.get('/confirm/:token', confirm);

/**
 * is for the user that forgot his password
 * @name forgot
 * @path {post} /api/users/forgotpassword
 */
router.post('/forgotpassword', forgotPassword);

/**
 * if the user receive instruccions for recue password, have to check his token
 * @name check
 * @path {get} /api/users/forgotpassword/:token
 */
router.get('/forgotpassword/:token', checkToken);

/**
 * write new user password
 * @name write new password
 * @path {post} /api/users/forgotpassword/:token
 */
router.post('/forgotpassword/:token', newPassword);

// if is get run checkPassword, if post run newPassword
// router.post('/forgotpassword/:token').get(checkToken).post(newPassword);

/**
 * get information for refresh page
 * @name get information user
 * @path {get} /api/profile
 */
router.get('/profile', checkAuth, profile);

export default router;
