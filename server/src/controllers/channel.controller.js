import { validationResult } from 'express-validator';
import prisma from '../prisma.js';
import permissionCache from '../services/permissionCache.service.js';

// ─── POST /api/servers/:serverId/channels ─────────────────────────────────────
// Create channel in server (requires isMember + isOwner middleware)
export async function createChannel(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { serverId } = req.params;
    const { name, type = 'TEXT' } = req.body;

    // Normalize channel name (lowercase, no spaces, hyphens only like Discord)
    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '-');

    const channel = await prisma.channel.create({
      data: {
        name: normalizedName,
        type: type.toUpperCase() === 'VOICE' ? 'VOICE' : 'TEXT',
        serverId,
      },
    });

    return res.status(201).json({ channel });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/servers/:serverId/channels/:channelId ─────────────────────────
// Rename channel (requires isMember + isOwner middleware)
export async function updateChannel(req, res, next) {
  try {
    const { serverId, channelId } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Channel name must be at least 2 characters long' });
    }

    // Verify channel belongs to this server
    const channel = await prisma.channel.findFirst({
      where: { id: channelId, serverId },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found in this server' });
    }

    const normalizedName = name.trim().toLowerCase().replace(/\s+/g, '-');

    const updatedChannel = await prisma.channel.update({
      where: { id: channelId },
      data: { name: normalizedName },
    });

    return res.json({ channel: updatedChannel });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/servers/:serverId/channels/:channelId ────────────────────────
// Delete channel (requires isMember + isOwner middleware)
export async function deleteChannel(req, res, next) {
  try {
    const { serverId, channelId } = req.params;

    // Verify channel belongs to this server
    const channel = await prisma.channel.findFirst({
      where: { id: channelId, serverId },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found in this server' });
    }

    await prisma.channel.delete({
      where: { id: channelId },
    });

    // Invalidate cached permissions for this channel
    permissionCache.invalidateChannel(channelId);

    return res.json({ message: 'Channel deleted' });
  } catch (err) {
    next(err);
  }
}

