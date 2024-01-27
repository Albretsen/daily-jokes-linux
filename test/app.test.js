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
            // Waiting to make sure DB operations finish before closing connection
            await new Promise(resolve => setTimeout(resolve, 3000));

            await client.end();

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
