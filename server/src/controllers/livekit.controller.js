import prisma from '../prisma.js';
import { generateLiveKitToken } from '../services/livekit.service.js';

export async function getLiveKitToken(req, res, next) {
  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ message: 'channelId is required' });
    }

    // Verify channel exists and is VOICE type
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        server: {
          include: {
            members: {
              where: { userId: req.user.id },
              include: { user: { select: { id: true, name: true } } },
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

    // Verify user is a member of the channel's server
    if (!channel.server.members.length) {
      return res.status(403).json({ message: 'You are not a member of this server' });
    }

    const userName = channel.server.members[0]?.user?.name || req.user.name || 'User';

    const token = await generateLiveKitToken({
      channelId,
      userId: req.user.id,
      userName,
    });

    res.json({ token, url: process.env.LIVEKIT_URL });
  } catch (err) {
    next(err);
  }
}

