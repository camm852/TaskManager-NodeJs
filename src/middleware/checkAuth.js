import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

/**
 * check auth from user
 * @param {string} req jwt from client
 * @param {json} res response for the client
 * @param {function} next  next to middlware
 * @returns {status | next} 404 if there is error or invalid token - next()
 */
const checkAuth = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1];
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

			//select("-password") is for bring everything except the password confirm token...
			req.user = await User.findById(decodedToken.id).select(
				'-password -confirm -token -createdAt -updatedAt -__v'
			);
		} catch (error) {
			return res.status(404).json({ msg: 'There was a error' });
		}
	}
	if (!token) {
		const error = new Error('Invalid token');
		return res.status(403).json({ msg: error.message });
	}

	next(); // next middleware
};

export default checkAuth;
