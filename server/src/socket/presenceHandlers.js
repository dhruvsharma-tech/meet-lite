import prisma from '../prisma.js';

// In-memory set of online user IDs
export const onlineUserIds = new Set();

export function registerPresenceHandlers(io, socket) {
  const userId = socket.userId;

  // 1. Mark user as online
  onlineUserIds.add(userId);

  // 2. Fetch all servers this user belongs to, join their rooms, and broadcast 'online' status
  async function broadcastOnline() {
    try {
      const memberships = await prisma.member.findMany({
        where: { userId },
        select: { serverId: true },
      });

      for (const m of memberships) {
        socket.join(m.serverId);
        io.to(m.serverId).emit('presence:update', {
          userId,
          status: 'online',
        });
      }
    } catch (err) {
      console.error('[Presence Online Broadcast Error]:', err);
    }
  }

  broadcastOnline();

  // 3. Client requests online presence list for a specific server
  socket.on('presence:get', async ({ serverId }, cb) => {
    try {
      if (!serverId) return;

      const members = await prisma.member.findMany({
        where: { serverId },
        select: { userId: true },
      });

      const onlineList = members
        .map((m) => m.userId)
        .filter((id) => onlineUserIds.has(id));

      if (typeof cb === 'function') {
        cb({ onlineUserIds: onlineList });
      } else {
        socket.emit('presence:list', { serverId, onlineUserIds: onlineList });
      }
    } catch (err) {
      console.error('[Presence Get Error]:', err);
    }
  });

  // 4. On disconnect, check if user has other sockets; if not, mark offline and broadcast
  socket.on('disconnect', async () => {
    onlineUserIds.delete(userId);

    try {
      const memberships = await prisma.member.findMany({
        where: { userId },
        select: { serverId: true },
      });

      for (const m of memberships) {
        io.to(m.serverId).emit('presence:update', {
          userId,
          status: 'offline',
        });
      }
    } catch (err) {
      console.error('[Presence Offline Broadcast Error]:', err);
    }
  });
}

