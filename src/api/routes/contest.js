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

        const contests = await Contest.findByCriteriaLegacy({ date: date });
        if (contests.length === 0) {
            return res.status(404).json({ error: "Contest not found" });
        }

        const contest = contests[0]; 

        const participants = await Contest.getContestParticipants(contest.id);

        const result = {
            ...contest,
            participants: participants,
            totalParticipants: await Contest.countDistinctContestParticipants(contest.id),
        };

        res.json([result]);
    } catch (error) {
        if (error.isClientError && error.isClientError()) {
            res.status(400).json({ error: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /contest/search:
 *   post:
 *     summary: Returns an array of contests
 *     description: Desc.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Successful response.
 */

router.post("/search", requireSchema(contestSchema), async (req, res, next) => {
    try {
        const criteria = req.body;
        
        const results = await Contest.findByCriteria(criteria);
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
