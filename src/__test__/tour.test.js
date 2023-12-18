const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../app');

// Use a different port for testing, e.g., 3001
const testPort = 3001;

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
  try {
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
    throw error;
  }

  // Close server
  await server.close();
});

describe('Tour API', () => {
  it('GET /tours --> tour array', async () => {
    const response = await request(app)
      .get('/api/tours')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({}));
  }, 10000);

  //   It("GET /tour/id  --> specified tour", async () => {
  //     await request(app).get("/tour/444885").expect(404);
  //   });
}, 10000);
