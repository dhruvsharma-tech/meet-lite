import prisma from '../prisma.js';

// Strip HTML tags to sanitize messages
function sanitizeContent(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/<[^>]*>?/gm, '').trim();
}

// In-memory cache: `${userId}:${channelId}` → true/false
// Avoids 2 DB queries per message for the same user+channel combo
// Cache is intentionally short-lived (cleared on socket disconnect by channelId)
const membershipCache = new Map();

function getCacheKey(userId, channelId) {
  return `${userId}:${channelId}`;
}

export function registerChatHandlers(io, socket) {
  // Join a channel's real-time room
  socket.on('channel:join', ({ channelId }) => {
    if (channelId && typeof channelId === 'string') {
      socket.join(channelId);
    }
  });

  // Leave a channel's real-time room
  socket.on('channel:leave', ({ channelId }) => {
    if (channelId && typeof channelId === 'string') {
      socket.leave(channelId);
      // Invalidate cache for this user+channel on leave
      membershipCache.delete(getCacheKey(socket.userId, channelId));
    }
  });

  // Send a persistent message to a text channel
  socket.on('message:send', async ({ channelId, content }, cb) => {
    try {
      const sanitized = sanitizeContent(content);

      if (!sanitized || sanitized.length === 0) {
        if (typeof cb === 'function') cb({ ok: false, error: 'Message cannot be empty' });
        return;
      }

      if (sanitized.length > 2000) {
        if (typeof cb === 'function') cb({ ok: false, error: 'Message cannot exceed 2000 characters' });
        return;
      }

      const cacheKey = getCacheKey(socket.userId, channelId);

      // Only hit DB if not cached — saves 2 round trips per message for established sessions
      if (!membershipCache.has(cacheKey)) {
        // 1. Verify channel exists and is TEXT
        const channel = await prisma.channel.findUnique({
          where: { id: channelId },
          select: { id: true, type: true, serverId: true },
        });

        if (!channel) {
          if (typeof cb === 'function') cb({ ok: false, error: 'Channel not found' });
          return;
        }

        if (channel.type !== 'TEXT') {
          if (typeof cb === 'function') cb({ ok: false, error: 'Cannot send messages to non-text channel' });
          return;
        }

        // 2. Verify user is a member of the channel's server
        const member = await prisma.member.findUnique({
          where: {
            userId_serverId: {
              userId: socket.userId,
              serverId: channel.serverId,
            },
          },
        });

        if (!member) {
          if (typeof cb === 'function') cb({ ok: false, error: 'You are not a member of this server' });
          return;
        }

        // Cache validated — subsequent messages skip DB checks
        membershipCache.set(cacheKey, true);
      }

      // 3. Save message to PostgreSQL (only 1 query now instead of 3)
      const message = await prisma.message.create({
        data: {
          content: sanitized,
          userId: socket.userId,
          channelId,
        },
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      // 4. Broadcast to everyone in channel room (other users)
      socket.to(channelId).emit('message:new', message);

      // 5. Acknowledge back to sender with confirmed message
      if (typeof cb === 'function') {
        cb({ ok: true, message });
      }
    } catch (err) {
      console.error('[Socket Chat Error]:', err);
      if (typeof cb === 'function') {
        cb({ ok: false, error: 'Failed to send message' });
      }
    }
  });

  // Clear cache on disconnect
  socket.on('disconnect', () => {
    // Remove all cache entries for this user
    for (const key of membershipCache.keys()) {
      if (key.startsWith(`${socket.userId}:`)) {
        membershipCache.delete(key);
      }
    }
  });
}

