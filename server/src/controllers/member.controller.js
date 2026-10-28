import prisma from '../prisma.js';

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

    res.json({ members });
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

    res.json({ message: 'Member kicked successfully' });
  } catch (err) {
    next(err);
  }
}

