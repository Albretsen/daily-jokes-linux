const supertest = require('supertest');
const { app, server } = require('../app');

const request = supertest(app);

describe('GET /ping', () => {
    it('should respond with a pong object', async () => {
        const response = await request.get('/ping');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "pong": "2" });
    });

    // Close server and database connection after all tests
    afterAll(async () => {
        await new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });

});
