import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getLiveKitToken } from '../controllers/livekit.controller.js';

const router = Router();

router.post('/token', authMiddleware, getLiveKitToken);

export default router;

