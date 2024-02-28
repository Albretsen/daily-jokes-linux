import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Ping should return pong 1
 *     description: Desc.
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pong:
 *                   type: integer
 *                   example: 1
 */

router.get("", async (req, res, next) => {
    try {
        const results = { pong: 1 }
        res.json(results);
    } catch (error) {
        if (error.isClientError && error.isClientError()) {
            res.status(400).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

export default router;
