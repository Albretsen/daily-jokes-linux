import { Router } from "express";

import JokeSubmissionService from "../../services/joke_submission.js";
import ContestService from "../../services/contest.js";

import { requireUser } from "../middlewares/auth.js";

const router = Router();

router.use(requireUser);

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
        if (error.isClientError()) {
            res.status(400).json({ error });
        } else {
            next(error);
        }
    }
});

export default router;