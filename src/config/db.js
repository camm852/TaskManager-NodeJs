import mongoose from 'mongoose';

/**
 * Data base config
 * @module
 *
 */

/**
 * Database function
 * @returns {void}
 */
const connectionDB = async () => {
	try {
		const connection = await mongoose.connect(
			// 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
			process.env.MONGO_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		const url = `${connection.connection.host}:${connection.connection.port}`;
		console.log(`MongoDB conecction in ${url}`);
	} catch (error) {
		console.log(`error ${error.message}`);
		process.exit(1);
	}
};

export default connectionDB;
