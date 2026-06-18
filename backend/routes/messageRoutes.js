import express from 'express';
import { sendMessage, getChatRoomsList, getConversation } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, sendMessage).get(protect, getChatRoomsList);
router.get('/user/:userId', protect, getConversation);

export default router;
