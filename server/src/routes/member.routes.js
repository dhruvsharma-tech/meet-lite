import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import isMember from '../middleware/isMember.middleware.js';
import isOwner from '../middleware/isOwner.middleware.js';
import { getMembers, kickMember } from '../controllers/member.controller.js';

const router = Router({ mergeParams: true });

router.get('/:serverId/members', authMiddleware, isMember, getMembers);
router.delete('/:serverId/members/:memberId', authMiddleware, isMember, isOwner, kickMember);

export default router;

