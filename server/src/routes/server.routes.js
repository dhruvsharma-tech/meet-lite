import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { isMember } from '../middleware/isMember.middleware.js';
import { isOwner } from '../middleware/isOwner.middleware.js';
import {
  createServer,
  getServers,
  getServerById,
  updateServer,
  deleteServer,
  leaveServer,
} from '../controllers/server.controller.js';
import channelRouter from './channel.routes.js';

const router = Router();

// All server routes require authentication
router.use(authMiddleware);

// Validation rules
const serverRules = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Server name must be between 2 and 100 characters'),
];

// Server CRUD & Member actions
router.post('/', serverRules, createServer);
router.get('/', getServers);
router.get('/:serverId', isMember, getServerById);
router.patch('/:serverId', isMember, isOwner, updateServer);
router.delete('/:serverId', isMember, isOwner, deleteServer);
router.delete('/:serverId/leave', isMember, leaveServer);

// Nested Channel Routes: /api/servers/:serverId/channels
router.use('/:serverId/channels', channelRouter);

export default router;
