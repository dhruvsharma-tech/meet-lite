import prisma from '../prisma.js';
import { generateLiveKitToken } from '../services/livekit.service.js';

export async function getLiveKitToken(req, res, next) {
  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ message: 'channelId is required' });
    }

    if (!process.env.LIVEKIT_URL || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return res.status(500).json({ message: 'LiveKit server credentials not configured on backend' });
    }

    // 1. Verify channel exists and is VOICE type
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        server: {
          include: {
            members: {
              where: { userId: req.user.id },
              include: { user: { select: { id: true, name: true, avatar: true } } },
            },
          },
        },
      },
    });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.type !== 'VOICE') {
      return res.status(400).json({ message: 'Channel is not a VOICE channel' });
    }

    // 2. Verify user is a member of the channel's server
    const currentMember = channel.server.members[0];
    if (!currentMember) {
      return res.status(403).json({ message: 'You are not a member of this server' });
    }

    const userName = currentMember.user?.name || req.user.name || 'User';
    const userAvatar = currentMember.user?.avatar || req.user.avatar || null;

    // 3. Generate token with 6h TTL, explicit grants & profile metadata
    const token = await generateLiveKitToken({
      channelId,
      userId: req.user.id,
      userName,
      userAvatar,
      ttl: '6h',
    });

    res.json({
      token,
      url: process.env.LIVEKIT_URL,
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getLiveKitToken,
};
