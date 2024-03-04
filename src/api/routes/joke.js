import { Router } from "express";

import JokeService from "../../services/joke.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/joke.js";
import { GenerateJokeJSON } from "../../utils/joke.js";
import JokeSubmissionService from "../../services/joke_submission.js";
import UserJokeLikeService from "../../services/user_joke_like.js";
import ContestService from "../../services/contest.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: Joke
 *   description: API for managing Joke objects
 *
 * /joke:
 *   get:
 *     tags: [Joke]
 *     summary: Get all the Joke objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Joke objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Joke'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await JokeService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /joke:
 *   post:
 *     tags: [Joke]
 *     summary: Create a new Joke
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Joke'
 *     responses:
 *       201:
 *         description: The created Joke object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const submissionStatus = await JokeSubmissionService.submitJoke(req.user.id);

    if (!submissionStatus.canSubmit) {
      return res.status(400).json({
        error: "No submissions available",
        remainingSubmissions: submissionStatus.remainingSubmissions
      });
    }

    const jokeData = await GenerateJokeJSON(req.user.id, req.validatedBody.textBody);
    const obj = await JokeService.create(jokeData);

    return res.status(201).json({
      joke: obj,
      message: submissionStatus.message,
      remainingSubmissions: submissionStatus.remainingSubmissions
    });

  } catch (error) {
    if (error.isClientError && typeof error.isClientError === 'function' && error.isClientError()) {
      return res.status(400).json({ error: error.message });
    } else {
      console.error("Unhandled error in POST /joke:", error);
      return next(error);
    }
  }
});


/** @swagger
 *
 * /joke/search:
 *   get:
 *     tags: [Joke]
 *     summary: Search Jokes by criteria
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the user to filter jokes by
 *       - in: query
 *         name: contestId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the contest to filter jokes by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Field to sort the jokes by (prefix with '-' for descending order)
 *     responses:
 *       200:
 *         description: List of Joke objects that match the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Joke'
 */
router.post("/search", async (req, res, next) => {
  try {
    const criteria = req.body;
    
    const results = await JokeService.findByCriteria(criteria);
    res.json(results);
  } catch (error) {
    console.log("here");
    console.log(error);
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /joke/search:
 *   get:
 *     tags: [Joke]
 *     summary: Search Jokes by criteria for swipe
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the user to filter jokes by
 *       - in: query
 *         name: contestId
 *         schema:
 *           type: string
 *         required: false
 *         description: The ID of the contest to filter jokes by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Field to sort the jokes by (prefix with '-' for descending order)
 *     responses:
 *       200:
 *         description: List of Joke objects that match the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Joke'
 */
router.post("/search/swipe", async (req, res, next) => {
  try {
    const currentContestId = (await ContestService.getCurrentContest()).id;
    let likedJokeIds = await UserJokeLikeService.findJokeIdsByContest(currentContestId, req.user.id);

    let criteria = req.body;

    criteria.exclude = criteria.exclude || {};
    criteria.filters = criteria.filters || {};

    if (likedJokeIds.length > 0) {
        criteria.exclude.id = { notIn: likedJokeIds };
    }

    criteria.filters.contestId = currentContestId;
    criteria.exclude.userId = { not: req.user.id };

    const results = await JokeService.findByCriteria(criteria);

    res.json(results);
  } catch (error) {
    console.log("Error in /search/swipe:", error);
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /joke/rate/{id}:
 *   get:
 *     tags: [Joke]
 *     summary: Rate a Joke by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Joke object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 */
const LIKE_VALUE = 1;
const SUPER_LIKE_VALUE = 3;
router.post("/rate/:id/:rating", requireValidId, async (req, res, next) => {
  try {
    if (await UserJokeLikeService.verifyJokeNotAlreadyLiked(req.params.id, req.user.id)) {
      res.status(400).json({ error: "Already liked" });
      return;
    }

    let obj = await JokeService.get(req.params.id);
    let score = 0;

    if (req.params.rating == "like") score = LIKE_VALUE;
    if (req.params.rating == "superlike") score = SUPER_LIKE_VALUE;

    if (obj) {
      obj = await JokeService.update(obj.id, { score: obj.score + score });
      await UserJokeLikeService.create({
        userId: req.user.id,
        jokeId: obj.id,
        contestId: obj.contestId,
        value: score,
      });
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /joke/{id}:
 *   get:
 *     tags: [Joke]
 *     summary: Get a Joke by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Joke object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await JokeService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /joke/{id}:
 *   put:
 *     tags: [Joke]
 *     summary: Update Joke with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Joke'
 *     responses:
 *       200:
 *         description: The updated Joke object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Joke'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await JokeService.update(req.params.id, req.validatedBody);
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      if (error.isClientError && error.isClientError()) {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
);

/** @swagger
 *
 * /joke/{id}:
 *   delete:
 *     tags: [Joke]
 *     summary: Delete Joke with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await JokeService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
