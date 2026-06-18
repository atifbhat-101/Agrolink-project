import express from 'express';
import { createLot, deleteLot, getAllLots, getFarmerLots, getLotById, updateLotStatus } from '../controllers/lotController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getAllLots).post(protect, authorizeRoles('farmer'), createLot);
router.get('/my-lots', protect, authorizeRoles('farmer'), getFarmerLots);
router.route('/:id')
  .get(protect, getLotById)
  .put(protect, authorizeRoles('farmer'), updateLotStatus)
  .delete(protect, authorizeRoles('farmer'), deleteLot);

export default router;
