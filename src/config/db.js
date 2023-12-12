const mongoose = require('mongoose');

const connect = async () => {
	const uri
    = process.env.NODE_ENV === 'test'
    	? process.env.TESTDB_URI
    	: process.env.MONGO_URI;
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(
			`Connected to ${
				process.env.NODE_ENV === 'test'
					? 'test database'
					: 'production/development database'
			}`,
		);
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
};

const disconnectFromDatabase = async () => {
	try {
		await mongoose.disconnect();
		console.log('Disconnected from the database');
	} catch (error) {
		console.error('Error disconnecting from the database:', error);
		throw error;
	}
};

module.exports = {
	connect,
	disconnectFromDatabase,
};
