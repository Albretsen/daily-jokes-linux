import { Router } from "express";

import IAPService from "../../services/iap.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: IAP
 *   description: API for managing IAP objects
 *
 * /iap/webhook:
 *   post:
 *     tags: [IAP]
 *     summary: RevenueCat Webhook
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: IAP object
 */
router.post("/webhook/revenuecat", async (req, res) => {
    try {
      if (req.user.id !== 1) {
        throw new Error("Authentication error");
      }
  
      const { product_id, app_user_id } = req.body.event;
  
      if (/^\d+_coins$/.test(product_id)) {
        await IAPService.processProductPurchase(product_id, app_user_id);
      }
  
      res.status(200).json({ });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;