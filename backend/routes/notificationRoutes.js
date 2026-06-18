import express from 'express';
import { getUserNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getUserNotifications).put(protect, markNotificationsAsRead);

export default router;
