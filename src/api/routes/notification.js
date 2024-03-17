import { Router } from "express";

import NotificationService from "../../services/notification.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: Notification
 *   description: API for managing notification objects
 *
 * /notification:
 *   get:
 *     tags: [Notification]
 *     summary: Get all the notification objects by criteria
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notification objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.post("", async (req, res, next) => {
    try {
        let criteria = req.body;

        if (!criteria) criteria.filters.userId = req.user.id;
        else {
            if (!criteria.filters) criteria.filters = {};
            criteria.filters.userId = req.user.id;
        }

        const results = await NotificationService.findByCriteria(criteria);
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