import express from 'express';
import { getAdminOverview, getUsers, removeUser } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect, authorizeRoles('admin'));
router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.delete('/users/:id', removeUser);

export default router;
