import prisma from '../prisma.js';

export async function isMember(req, res, next) {
  try {
    const { serverId } = req.params;

    if (!serverId) {
      return res.status(400).json({ error: 'Server ID is required' });
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_serverId: {
          userId: req.user.id,
          serverId,
        },
      },
      include: {
        server: true,
      },
    });

    if (!member) {
      return res.status(403).json({ error: 'Forbidden: You are not a member of this server' });
    }

    req.member = member;
    next();
  } catch (err) {
    next(err);
  }
}
