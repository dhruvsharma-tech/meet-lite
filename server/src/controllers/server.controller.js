import { validationResult } from 'express-validator';
import prisma from '../prisma.js';

// ─── POST /api/servers ────────────────────────────────────────────────────────
// Create server, create default #general TEXT channel, add creator as OWNER
export async function createServer(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, icon } = req.body;
    const userId = req.user.id;

    // Use interactive transaction to guarantee consistency
    const server = await prisma.$transaction(async (tx) => {
      // 1. Create server
      const newServer = await tx.server.create({
        data: {
          name: name.trim(),
          icon: icon || null,
          ownerId: userId,
        },
      });

      // 2. Auto-create default #general channel
      await tx.channel.create({
        data: {
          name: 'general',
          type: 'TEXT',
          serverId: newServer.id,
        },
      });

      // 3. Add creator as member with role OWNER
      await tx.member.create({
        data: {
          userId,
          serverId: newServer.id,
          role: 'OWNER',
        },
      });

      // 4. Return server with channels and members included
      return tx.server.findUnique({
        where: { id: newServer.id },
        include: {
          channels: { orderBy: { createdAt: 'asc' } },
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
        },
      });
    });

    return res.status(201).json({ server });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/servers ─────────────────────────────────────────────────────────
// Return all servers where requesting user is a member
export async function getServers(req, res, next) {
  try {
    const userId = req.user.id;

    const servers = await prisma.server.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        channels: { orderBy: { createdAt: 'asc' } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ servers });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/servers/:serverId ───────────────────────────────────────────────
// Return full server details (requires isMember middleware)
export async function getServerById(req, res, next) {
  try {
    const { serverId } = req.params;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        channels: { orderBy: { createdAt: 'asc' } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    return res.json({
      server,
      channels: server.channels,
      members: server.members,
    });
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/servers/:serverId ─────────────────────────────────────────────
// Update server name and/or icon (requires isMember + isOwner middleware)
export async function updateServer(req, res, next) {
  try {
    const { serverId } = req.params;
    const { name, icon } = req.body;

    const data = {};
    if (name && typeof name === 'string' && name.trim().length >= 2) {
      data.name = name.trim();
    }
    if (icon !== undefined) {
      data.icon = icon;
    }

    const updatedServer = await prisma.server.update({
      where: { id: serverId },
      data,
      include: {
        channels: { orderBy: { createdAt: 'asc' } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    return res.json({ server: updatedServer });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/servers/:serverId ────────────────────────────────────────────
// Delete server & cascade all relations (requires isMember + isOwner middleware)
export async function deleteServer(req, res, next) {
  try {
    const { serverId } = req.params;

    await prisma.server.delete({
      where: { id: serverId },
    });

    return res.json({ message: 'Server deleted' });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/servers/:serverId/leave ──────────────────────────────────────
// Leave server (requires isMember middleware, non-owner only)
export async function leaveServer(req, res, next) {
  try {
    const { serverId } = req.params;
    const member = req.member;

    if (member.role === 'OWNER') {
      return res.status(400).json({
        error: 'Server owner cannot leave. Delete the server or transfer ownership.',
      });
    }

    await prisma.member.delete({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId,
        },
      },
    });

    return res.json({ message: 'Left server' });
  } catch (err) {
    next(err);
  }
}
