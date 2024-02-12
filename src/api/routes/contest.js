import { Router } from "express";
import Contest from "../../services/contest.js";

const router = Router();

/**
 * @swagger
 * /contest:
 *   get:
 *     summary: Returns todays contest
 *     description: Desc.
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topic:
 *                   type: string
 *                   example: "Puns"
 */

router.get("", async (req, res, next) => {
    try {
        const results = await Contest.findByCriteria({ date: new Date(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)})
        res.json(results);
    } catch (error) {
        if (error.isClientError()) {
            res.status(400).json({ error });
        } else {
            next(error);
        }
    }
});

export default router;
