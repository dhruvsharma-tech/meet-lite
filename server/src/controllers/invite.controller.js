import { randomBytes } from 'crypto';
import prisma from '../prisma.js';

export async function generateInvite(req, res, next) {
  try {
    const { serverId } = req.params;
    const code = randomBytes(6).toString('base64url').slice(0, 8);

    const invite = await prisma.invite.create({
      data: { code, serverId, createdById: req.user.id },
    });

    res.status(201).json({ code: invite.code });
  } catch (err) {
    next(err);
  }
}

export async function getInvitePreview(req, res, next) {
  try {
    const { code } = req.params;

    const invite = await prisma.invite.findUnique({
      where: { code },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            icon: true,
            _count: { select: { members: true } },
          },
        },
      },
    });

    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    res.json({ server: invite.server });
  } catch (err) {
    next(err);
  }
}

export async function joinByInvite(req, res, next) {
  try {
    const { code } = req.params;
    const userId = req.user.id;

    const invite = await prisma.invite.findUnique({
      where: { code },
      include: { server: true },
    });

    if (!invite) return res.status(404).json({ message: 'Invite not found' });

    const alreadyMember = await prisma.member.findFirst({
      where: { userId, serverId: invite.serverId },
    });

    if (alreadyMember) {
      return res.json({ server: invite.server, alreadyMember: true });
    }

    await prisma.member.create({
      data: { userId, serverId: invite.serverId, role: 'MEMBER' },
    });

    const server = await prisma.server.findUnique({
      where: { id: invite.serverId },
      include: {
        channels: { orderBy: { createdAt: 'asc' } },
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });

    res.status(201).json({ server });
  } catch (err) {
    next(err);
  }
}

