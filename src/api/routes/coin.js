import { Router } from "express";

import CoinService from "../../services/coin.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: Coin
 *   description: API for managing Coin objects
 *
 * /coin:
 *   get:
 *     tags: [Coin]
 *     summary: Get coins for signed in user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Coin object
 */
router.get("", async (req, res, next) => {
  try {
    const results = await CoinService.get(req.user.id);
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