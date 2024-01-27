const supertest = require('supertest');
const { app, server, client } = require('../app');

const request = supertest(app);

describe('GET /ping', () => {
    it('should respond with a pong object', async () => {
        const response = await request.get('/ping');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ "pong": "2" });
    });

    afterAll(async () => {
        try {
            // First, close the PostgreSQL client connection
            await client.end();

            // Then, close the server
            await new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        } catch (error) {
            console.error('Error during shutdown:', error);
        }
    });

});
