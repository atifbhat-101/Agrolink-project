import express from 'express';
import { createRequest, getBuyerRequests, getFarmerIncomingRequests, updateRequestStatus } from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.route('/').post(protect, authorizeRoles('buyer'), createRequest);
router.get('/buyer', protect, authorizeRoles('buyer'), getBuyerRequests);
router.get('/farmer', protect, authorizeRoles('farmer'), getFarmerIncomingRequests);
router.put('/:id/status', protect, authorizeRoles('farmer'), updateRequestStatus);

export default router;
