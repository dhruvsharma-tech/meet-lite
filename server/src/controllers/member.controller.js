import prisma from '../prisma.js';
import permissionCache from '../services/permissionCache.service.js';
import { onlineUserIds } from '../socket/presenceHandlers.js';

export async function getMembers(req, res, next) {
  try {
    const { serverId } = req.params;

    const members = await prisma.member.findMany({
      where: { serverId },
      include: {
        user: { select: { id: true, name: true, avatar: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const membersWithPresence = members.map((m) => {
      const isOnline = onlineUserIds.has(m.userId);
      return {
        ...m,
        status: isOnline ? 'online' : 'offline',
        user: {
          ...m.user,
          isOnline,
        },
      };
    });

    res.json({ members: membersWithPresence });
  } catch (err) {
    next(err);
  }
}

export async function kickMember(req, res, next) {
  try {
    const { serverId, memberId } = req.params;

    const target = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!target || target.serverId !== serverId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (target.userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot kick yourself' });
    }

    if (target.role === 'OWNER') {
      return res.status(403).json({ message: 'Cannot kick another owner' });
    }

    await prisma.member.delete({ where: { id: memberId } });

    // Invalidate target user's cached permissions for this server immediately
    permissionCache.invalidateServerUser(serverId, target.userId);

    res.json({ message: 'Member kicked successfully' });
  } catch (err) {
    next(err);
  }
}

