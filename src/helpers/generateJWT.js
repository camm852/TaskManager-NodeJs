import jwt from 'jsonwebtoken';

/**
 * generateJWT
 * @param {string} id user's id of the mongo database
 * @returns {Object} return a JWT
 */
const generateJWT = (id) => {
	//information, signature, and options
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export default generateJWT;
