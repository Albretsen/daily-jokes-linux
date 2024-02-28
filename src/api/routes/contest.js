import { Router } from "express";
import Contest from "../../services/contest.js";
import { contestSchema } from "../schemas/contest.js";
import { requireSchema } from "../middlewares/validate.js";

const router = Router();

/**
 * @swagger
 * /contest:
 *   get:
 *     summary: Returns todays contest
 *     description: Desc.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/contestSchema'
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

router.get("", requireSchema(contestSchema), async (req, res, next) => {
    try {
        let date = req.validatedBody.date;

        if (!date) date = new Date();
        else date = new Date(req.validatedBody.date);

        const results = await Contest.findByCriteria({ date: date });
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
