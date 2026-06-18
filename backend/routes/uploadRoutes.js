import express from 'express';
import { uploadMediaFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, upload.single('image'), uploadMediaFile);

export default router;
