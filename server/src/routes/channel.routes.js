import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isMember } from '../middleware/isMember.middleware.js';
import { isOwner } from '../middleware/isOwner.middleware.js';
import {
  createChannel,
  updateChannel,
  deleteChannel,
} from '../controllers/channel.controller.js';

// mergeParams: true allows accessing :serverId from the parent router
const router = Router({ mergeParams: true });

// All channel routes require authentication and server membership
router.use(authMiddleware);
router.use(isMember);

// Validation rules
const channelRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 32 })
    .withMessage('Channel name must be between 2 and 32 characters'),
  body('type')
    .optional()
    .isIn(['TEXT', 'VOICE'])
    .withMessage('Channel type must be TEXT or VOICE'),
];

// Routes (all modifications restricted to server OWNER)
router.post('/', isOwner, channelRules, createChannel);
router.patch('/:channelId', isOwner, updateChannel);
router.delete('/:channelId', isOwner, deleteChannel);

export default router;

