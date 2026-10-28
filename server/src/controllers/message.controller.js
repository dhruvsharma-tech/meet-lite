import prisma from '../prisma.js';

// ─── GET /api/channels/:channelId/messages ────────────────────────────────────
// Cursor-based pagination for text channel messages
export async function getMessages(req, res, next) {
  try {
    const { channelId } = req.params;
    const { cursor } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    // 1. Verify channel exists and is TEXT
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { id: true, type: true, serverId: true },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    if (channel.type !== 'TEXT') {
      return res.status(400).json({ error: 'Messages can only be fetched for TEXT channels' });
    }

    // 2. Verify user is a member of the channel's server
    const member = await prisma.member.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId: channel.serverId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Forbidden: You are not a member of this server' });
    }

    // 3. Fetch messages using cursor-based pagination (newest first)
    const findArgs = {
      take: limit + 1, // take 1 extra to check if there is a next page
      where: { channelId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    };

    if (cursor) {
      findArgs.cursor = { id: cursor };
      findArgs.skip = 1; // skip the cursor itself
    }

    const messages = await prisma.message.findMany(findArgs);

    let nextCursor = null;
    if (messages.length > limit) {
      const nextItem = messages.pop(); // remove extra item
      nextCursor = nextItem.id;
    }

    return res.json({
      messages,
      nextCursor,
    });
  } catch (err) {
    next(err);
  }
}

