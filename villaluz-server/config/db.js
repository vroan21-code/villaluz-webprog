const dns = require('dns');
const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI is not defined. Add it in Vercel Environment Variables.');
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		// Helps MongoDB SRV lookup on Windows and some serverless environments
		dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

		cached.promise = mongoose
			.connect(process.env.MONGO_URI, { bufferCommands: false })
			.then((mongooseInstance) => {
				console.log(
					`MongoDB Connected: ${mongooseInstance.connection.host} (database: ${mongooseInstance.connection.name})`
				);
				return mongooseInstance;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		console.error(`MongoDB Error: ${error.message}`);
		throw error;
	}

	return cached.conn;
};

module.exports = connectDB;
