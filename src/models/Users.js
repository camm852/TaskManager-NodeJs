import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; //for hash passwords

/**
 * User
 * @typedef {Object} User
 * @property {string} name username
 * @property {string} email useremail
 * @property {string} token usertoken for sed request confirm user or for change password
 * @property {boolean} confirm if the user is confirmed
 */

/**
 * @type {User}
 */
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true, //delete spaces before and after
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		token: {
			type: String,
		},
		confirm: {
			type: Boolean,
			default: false,
		},
	},
	{
		//hour create and last update
		timestamps: true,
	}
);

/**
 * middleware of mongoose
 * pre save user, encrypt password
 * @param {next} callback will make sure the rest of this function doesn't run
 * @returns {void}
 */
userSchema.pre('save', async function (next) {
	//operator  "this" is for the object that is coming from controller
	if (!this.isModified('password')) {
		// if im not modifing the password?
		next(); //same to return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

/**
 * create our method, compare input password with bd password
 * @param {string} formPassword password entry
 * @returns {boolean} return true or false if are same
 */
userSchema.methods.checkPassword = async function (formPassword) {
	return await bcrypt.compare(formPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
