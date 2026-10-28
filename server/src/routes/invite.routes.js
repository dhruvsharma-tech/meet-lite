import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import isMember from '../middleware/isMember.middleware.js';
import { generateInvite, getInvitePreview, joinByInvite } from '../controllers/invite.controller.js';

const router = Router();

router.post('/servers/:serverId/invites', authMiddleware, isMember, generateInvite);
router.get('/invites/:code', getInvitePreview);
router.post('/invites/:code/join', authMiddleware, joinByInvite);

export default router;
