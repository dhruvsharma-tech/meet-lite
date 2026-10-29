import prisma from '../prisma.js';

// In-memory set of online user IDs
export const onlineUserIds = new Set();

// Cache: userId → serverIds[] — avoids repeated DB queries on connect/disconnect
// Cleared on disconnect; max TTL not needed since socket lifecycle manages it
const userServerCache = new Map();

async function getUserServerIds(userId) {
  if (userServerCache.has(userId)) {
    return userServerCache.get(userId);
  }
  const memberships = await prisma.member.findMany({
    where: { userId },
    select: { serverId: true },
  });
  const serverIds = memberships.map((m) => m.serverId);
  userServerCache.set(userId, serverIds);
  return serverIds;
}

export function registerPresenceHandlers(io, socket) {
  const userId = socket.userId;

  // 1. Mark user as online
  onlineUserIds.add(userId);

  // 2. Fetch servers (cached), join rooms, broadcast 'online' status
  async function broadcastOnline() {
    try {
      const serverIds = await getUserServerIds(userId);

      for (const serverId of serverIds) {
        socket.join(serverId);
        io.to(serverId).emit('presence:update', {
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

  // 4. On disconnect, broadcast offline using cached server IDs (no DB query)
  socket.on('disconnect', async () => {
    onlineUserIds.delete(userId);

    try {
      // Use cache — no DB round-trip on disconnect
      const serverIds = userServerCache.get(userId) || [];
      userServerCache.delete(userId); // clear cache on disconnect

      for (const serverId of serverIds) {
        io.to(serverId).emit('presence:update', {
          userId,
          status: 'offline',
        });
      }
    } catch (err) {
      console.error('[Presence Offline Broadcast Error]:', err);
    }
  });
}

