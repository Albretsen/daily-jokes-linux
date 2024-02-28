import { Router } from "express";

import JokeSubmissionService from "../../services/joke_submission.js";
import ContestService from "../../services/contest.js";

const router = Router();

/**
 * @swagger
 * /jokeSubmission:
 *   get:
 *     summary: Returns the active jokeSubmission
 *     description: Desc.
 *     responses:
 *       200:
 *         description: Successful response.
 */

router.get("", async (req, res, next) => {
    try {
        let contest = await ContestService.getCurrentContest();
        const results = await JokeSubmissionService.getOrCreateSubmission(req.user.id, contest.id);
        res.json(results);
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
 * /jokeSubmission/purchase:
 *   post:
 *     summary: Returns the active jokeSubmission
 *     description: Desc.
 *     responses:
 *       200:
 *         description: Successful response.
 */

router.post("/purchase", async (req, res, next) => {
    try {
        const results = await JokeSubmissionService.purchaseAdditionalSlot(req.user.id);
        res.json(results);
    } catch (error) {
        if (error.isClientError && error.isClientError()) {
            res.status(400).json({ error: error.message });
        } else if (error.message == 'Insufficient coin amount') {
            res.status(400).json({ error });
        } else {
            next(error);
        }
    }
});

export default router;