const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../app');

// Use a different port for testing, e.g., 3001
const testPort = 3002;

beforeAll(async () => {
	// Connect to the database before all tests
	try {
		await mongoose.connect(`${process.env.TESTDB_URI}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('connected to db');
	} catch (error) {
		console.error('Error disconnecting from the database:', error);
		throw error;
	}

	// Start the server on the test port
	app.listen(testPort);
});

afterAll(async () => {
	// Close the server and disconnect from the database after all tests
	await server.close();
	try {
		await mongoose.disconnect();
		console.log('Disconnected from the database');
	} catch (error) {
		console.error('Error disconnecting from the database:', error);
		throw error;
	}
});

// Write test for user login and reqistration

describe('User API', () => {
	it('POST User --> create new user', async () => {
		const response = await request(app)
			.post('/api/auth/register')
			.expect('Content-Type', /json/);

		expect(response.statusCode)
			.toBe(201)
			.expect(response.body)
			.toEqual(
				expect.objectContaining({
					username: 'johnny',
					email: 'john@gmail.com',
					password: 'password',
					role: 'user',
				}),
			);
	});

	it('POST User --> login user', () => {});
	it('GET single User --> specific user', () => {});
	it('GET User --> array user', () => {});
});
