export function isOwner(req, res, next) {
  if (!req.member) {
    return res.status(403).json({ error: 'Forbidden: Membership verification required' });
  }

  if (req.member.role !== 'OWNER') {
    return res.status(403).json({ error: 'Forbidden: Only the server owner can perform this action' });
  }

  next();
}

export default isOwner;

