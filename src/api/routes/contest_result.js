import { Router } from "express";

import ContestResultService from "../../services/contest_result.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: ContestResult
 *   description: API for managing ContestResult objects
 *
 * /contestresult/unread:
 *   get:
 *     tags: [ContestResult]
 *     summary: Get unread contest results for signed in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: ContestResult object
 */
router.get("/unread", async (req, res) => {
    const checkInterval = 5000; // Check every 5 seconds
    const maxWaitTime = 60000; // Wait up to 1 minute before sending a timeout response

    const startTime = Date.now();

    const checkForNewResults = async () => {
        try {
            const results = await ContestResultService.findByCriteria({
                filters: { userId: req.user.id, read: false }
            });
            if (results.length > 0 || Date.now() - startTime >= maxWaitTime) {
                res.json(results);
            } else {
                setTimeout(checkForNewResults, checkInterval);
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };

    checkForNewResults();
});

/** @swagger
 * /contestresult/read/:id:
 *   get:
 *     tags: [ContestResult]
 *     summary: Set contest result to read
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 */
router.get("/read/:id", async (req, res, next) => {
    try {
      const results = await ContestResultService.update(parseInt(req.params.id), { read: true });
      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  });

export default router;