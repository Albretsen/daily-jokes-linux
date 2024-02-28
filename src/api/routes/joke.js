import { Router } from "express";

import JokeService from "../../services/joke.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/joke.js";
import { GenerateJokeJSON } from "../../utils/joke.js";
import JokeSubmissionService from "../../services/joke_submission.js";

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
      res.status(400).json({ error: "No submissions available", remainingSubmissions: submissionStatus.remainingSubmissions });
    } else {
      const jokeData = await GenerateJokeJSON(req.user.id, req.validatedBody.textBody);
      const obj = await JokeService.create(jokeData);

      res.status(201).json({
        joke: obj,
        message: submissionStatus.message,
        remainingSubmissions: submissionStatus.remainingSubmissions
      });
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
