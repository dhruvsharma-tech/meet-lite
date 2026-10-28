import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getMessages } from '../controllers/message.controller.js';

const router = Router();

// Protect message routes with JWT auth
router.use(authMiddleware);

// GET /api/channels/:channelId/messages
router.get('/:channelId/messages', getMessages);

export default router;

