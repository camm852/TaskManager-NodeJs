/**
 * User Controller
 * @module
 */

import User from '../models/Users.js';
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import { emailSignUp, changePassword } from '../helpers/email.js';

/**
 * signUp user
 * @param {User} req request of the client, whithout confirm and token
 * @param {json} res response for the client
 * @returns {status} 400 if the user already registered
 */
const signUp = async (req, res) => {
	//avoid duplicate records
	const { email } = req.body;
	const existsUser = await User.findOne({ email });

	if (existsUser) {
		const error = new Error('User already registered');
		return res.status(400).json({ msg: error.message });
	}

	try {
		const user = new User(req.body);
		user.token = generateId();
		const userStored = await user.save();

		//send data to emailSignUp
		const { email, name, token } = userStored;
		emailSignUp({
			name,
			email,
			token,
		});

		res.json({ msg: 'Registered Successfully, check your email' });
	} catch (error) {
		console.log(error);
	}
};

/**
 * Login user
 * @param {{email: string, password: string}} req request of the client
 * @param {json} res response for the client
 * @returns {status} 404 if user not exists, 403 if is not confirmed or password incorrect - 200 if all is right
 */
const login = async (req, res) => {
	const { email, password } = req.body;

	//check user exists
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('The user no exists');
		return res.status(404).json({ msg: error.message });
	}

	//check if user is confirm
	if (!user.confirm) {
		const error = new Error('The user is not confirmed');
		return res.status(403).json({ msg: error.message });
	}

	//check his password
	if (await user.checkPassword(password)) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateJWT(user._id),
		});
	} else {
		const error = new Error('The password is incorrect');
		res.status(403).json({ msg: error.message });
	}
};

/**
 * user confirm
 * @param {string} req user's token
 * @param {json} res response for the client
 * @return {status} 403 if the token is invalid - 200 if the token is valid
 */
const confirm = async (req, res) => {
	const { token } = req.params; //params is for the params in a url
	const userConfirm = await User.findOne({ token });
	if (!userConfirm) {
		const error = new Error('The token is invalid');
		return res.status(403).json({ msg: error.message });
	}

	try {
		userConfirm.confirm = true;
		userConfirm.token = '';
		await userConfirm.save();
		res.json({ msg: 'User confirmed successfully' });
	} catch (error) {
		console.log(error);
	}
};

/**
 *	forgot password
 * @param {string} req user email
 * @param {json} res response for the client
 * @retuns {status} 404 if email not exists - 200 if exists
 */
const forgotPassword = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		const error = new Error('The email not exists');
		res.status(404).json({ msg: error.message });
	}
	try {
		user.token = generateId();
		await user.save();

		//send token to email
		const { email, name, token } = user;
		changePassword({
			name,
			email,
			token,
		});

		res.json({ msg: 'We have sent an email with the instructions' });
	} catch (error) {
		console.log(error);
	}
};

/**
 * check token from /api/users/forgotpassword
 * @param {string} req user token
 * @param {json} res response for the client
 * @returns {status} 404 if invalid token - 200 if all is right
 */
const checkToken = async (req, res) => {
	const { token } = req.params;

	const tokenValid = await User.findOne({ token });

	if (tokenValid) {
		res.json({ msg: 'Valid token' });
	} else {
		const error = new Error('Invalid token');
		res.status(404).json({ msg: error.message });
	}
};

/**
 * new user password
 * @param {string} req new password
 * @param {json} res response for the client
 * @returns {status} 404 if invalid token - 200 if password was changed
 */
const newPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;
	const user = await User.findOne({ token });

	if (user) {
		user.password = password;
		user.token = '';
		try {
			await user.save();
			res.json({ msg: 'Password changed successfully' });
		} catch (error) {
			console.log(error);
		}
	} else {
		const error = new Error('Invalid token');
		res.status(404).json({ msg: error.message });
	}
};

const profile = async (req, res) => {
	const { user } = req;
	res.json({ user });
};

export {
	signUp,
	login,
	confirm,
	forgotPassword,
	checkToken,
	newPassword,
	profile,
};
