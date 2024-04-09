import { Router } from "express";

import UserService from "../../services/user.js";
import urls from "../urls.js";
import { requireUser, authenticateWithToken } from "../middlewares/auth.js";
import { requireSchema } from "../middlewares/validate.js";
import {
  registerSchema,
  updateSchema,
  changePasswordSchema,
  loginSchema,
} from "../schemas/auth.js";
import CoinService from "../../services/coin.js";
import ProfilePictureService from "../../services/profile_picture.js";
import ProfileBackgroundService from "../../services/profile_background.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: Authentication
 *   description: User authentication API
 *
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Authenticate with the service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       200:
 *         description: Successful login, with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, incorrect login credentials
 */
router.post(urls.auth.login, requireSchema(loginSchema), async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.get(urls.auth.login, (req, res) => {
  res.status(405).json({ error: "Login with POST instead" });
});

/** @swagger
 *
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register with the service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerSchema'
 *     responses:
 *       201:
 *         description: Successful registration, with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, registration failed
 */
router.post(
  urls.auth.register,
  requireSchema(registerSchema),
  async (req, res, next) => {
    if (req.user) {
      res.json({ user: req.user });
      return;
    }

    try {
      const user = await UserService.createUser(req.validatedBody);
      res.status(201).json({ user });
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
 * /auth/loginWithToken:
 *   post:
 *     tags: [Authentication]
 *     summary: Authenticates with token
 *     responses:
 *       204:
 *         description: Successful login, token validated
 */
router.post(urls.auth.loginWithToken, authenticateWithToken, async (req, res) => {
  console.log(req.user);
  res.json({ user: req.user });
});

// all auth routes after this can rely on existence of req.user
router.use(requireUser);

/** @swagger
 *
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out of the service - invalidate auth token
 *     responses:
 *       204:
 *         description: Successful logout, token invalidated
 */
router.post(urls.auth.logout, async (req, res) => {
  await UserService.regenerateToken(req.user);
  res.status(204).send();
});

/** @swagger
 *
 * /auth/update:
 *   post:
 *     tags: [Authentication]
 *     summary: Update user data
 *     responses:
 *       200:
 *         description: Successfully updated all columns
 */
router.post(urls.auth.update, [authenticateWithToken, requireSchema(updateSchema)], async (req, res) => {
  try {
    await UserService.update(req.user.id, req.body);
  } catch (error) {
    console.log(error.message);
    if (error.code == "P2002") res.status(200).send({ success: false, error: "Email already in use." });
  }
  res.status(200).send({ success: true });
});

router.get(urls.auth.logout, (req, res) => {
  res.status(405).json({ error: "Logout with POST instead" });
});

router.post(
  urls.auth.changePassword,
  requireSchema(changePasswordSchema),
  async (req, res) => {
    const { password } = req.validatedBody;

    await UserService.setPassword(req.user, password.toString());
    res.status(200).send({ success: true });
  }
);


router.post("/purchaseProfilePicture", authenticateWithToken, async (req, res, next) => {
  const { pictureId } = req.body;
  const userId = req.user.id;
  const amountToDecrement = 50; 

  try {
    const ownedPictures = await ProfilePictureService.getByUserId(userId);
    const isOwned = ownedPictures.some(picture => picture.pictureId === pictureId);

    if (isOwned) {
      return res.status(400).json({ error: "Profile picture is already owned" });
    }

    await CoinService.purchase(userId, amountToDecrement);

    try {
      await ProfilePictureService.create({ userId, pictureId });

      res.status(200).json({ message: "Profile picture purchased successfully", price: amountToDecrement });
    } catch (error) {
      await CoinService.addCoins(userId, amountToDecrement);
      res.status(500).json({ error: "Failed to purchase profile picture, coins refunded" });
    }
  } catch (error) {
    if (error.message === 'Insufficient coin amount') {
      res.status(400).json({ error: "Insufficient coins for this purchase" });
    } else {
      next(error);
    }
  }
});

router.post("/purchaseBackground", authenticateWithToken, async (req, res, next) => {
  const { backgroundId } = req.body;
  const userId = req.user.id;
  const amountToDecrement = 100; 

  try {
    const ownedBackgrounds = await ProfileBackgroundService.getByUserId(userId);
    const isOwned = ownedBackgrounds.some(background => background.backgroundId === backgroundId);

    if (isOwned) {
      return res.status(400).json({ error: "Background is already owned" });
    }

    await CoinService.purchase(userId, amountToDecrement);

    try {
      await ProfileBackgroundService.create({ userId, backgroundId });

      return res.status(200).json({ message: "Background purchased successfully", price: amountToDecrement });
    } catch (error) {
      await CoinService.addCoins(userId, amountToDecrement);
      return res.status(500).json({ error: "Failed to purchase background, coins refunded" });
    }
  } catch (error) {
    if (error.message === 'Insufficient coin amount') {
      return res.status(400).json({ error: "Insufficient coins for this purchase" });
    } else {
      next(error);
    }
  }
});

router.post("/changeProfilePicture", authenticateWithToken, async (req, res) => {
  const { pictureId } = req.body;
  const userId = req.user.id;

  try {
    const ownedPictures = await ProfilePictureService.getByUserId(userId);
    const isOwned = ownedPictures.some(picture => picture.pictureId === pictureId);

    if (!isOwned) {
      return res.status(403).json({ error: "Profile picture not owned by the user" });
    }

    await UserService.update(userId, { profile: pictureId });

    res.status(200).json({ message: "Profile picture changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to change profile picture" });
  }
});

router.post("/changeBackground", authenticateWithToken, async (req, res) => {
  const { backgroundId } = req.body;
  const userId = req.user.id;

  try {
    const ownedBackgrounds = await ProfileBackgroundService.getByUserId(userId);
    const isOwned = ownedBackgrounds.some(background => background.backgroundId === backgroundId);

    if (!isOwned) {
      return res.status(403).json({ error: "Background not owned by the user" });
    }

    await UserService.update(userId, { backgroundId: backgroundId });

    res.status(200).json({ message: "Background changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to change background" });
  }
});

router.post("/public/:id", authenticateWithToken, async (req, res, next) => {
  try {
      const result = await UserService.getPublicUserInfo(parseInt(req.params.id));
      if (result) {
        res.status(200).send({ user: result });
      } else {
        res.status(404).json({ error: "Not found, nothing deleted" });
      }
  } catch (error) {
    console.log(error);
    if (error.isClientError && error.isClientError()) {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

export default router;
