import prisma from '../prisma.js';

// In-memory set of online user IDs
export const onlineUserIds = new Set();

// Track sockets per user: Map<userId, Set<socketId>>
const userSockets = new Map();

// Cache: userId → serverIds[] — avoids repeated DB queries on connect/disconnect
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
  if (!userId) return;

  // 1. Mark user as online and track socket connection
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }
  userSockets.get(userId).add(socket.id);
  const wasAlreadyOnline = onlineUserIds.has(userId);
  onlineUserIds.add(userId);

  // 2. Fetch servers (cached), join rooms, broadcast 'online' status if newly online
  async function broadcastOnline() {
    try {
      const serverIds = await getUserServerIds(userId);

      for (const serverId of serverIds) {
        socket.join(serverId);
        // Broadcast online status to each server room
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
        cb({ serverId, onlineUserIds: onlineList });
      } else {
        socket.emit('presence:list', { serverId, onlineUserIds: onlineList });
      }
    } catch (err) {
      console.error('[Presence Get Error]:', err);
    }
  });

  // 4. On disconnect, broadcast offline if all user sockets closed
  socket.on('disconnect', async () => {
    const sockets = userSockets.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size > 0) {
        // User still has another socket/tab open
        return;
      }
      userSockets.delete(userId);
    }

    onlineUserIds.delete(userId);

    try {
      const serverIds = userServerCache.get(userId) || [];
      userServerCache.delete(userId); // clear cache on full disconnect

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


