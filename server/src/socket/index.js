import { parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { registerChatHandlers } from './chatHandlers.js';
import { registerTypingHandlers } from './typingHandlers.js';
import { registerPresenceHandlers } from './presenceHandlers.js';

// In-memory mapping of online users: Map<userId, socketId>
export const onlineUsers = new Map();

export function initSocketIO(io) {
  // ─── Socket.IO Authentication Middleware ────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      let token = null;

      // 1. Try extracting from HTTP-only cookie
      const rawCookie = socket.handshake.headers.cookie;
      if (rawCookie) {
        const parsed = parseCookie(rawCookie);
        token = parsed.token;
      }

      // 2. Fallback to handshake auth object
      if (!token && socket.handshake.auth?.token) {
        token = socket.handshake.auth.token;
      }

      if (!token) {
        return next(new Error('Authentication error: Missing token'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      // Fetch user profile info
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, avatar: true },
      });

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userName = user.name;
      socket.userAvatar = user.avatar;

      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // ─── Connection Handler ─────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.userName} (${socket.userId}) [${socket.id}]`);
    onlineUsers.set(socket.userId, socket.id);

    // Join / Leave Discord Server Rooms
    socket.on('server:join', ({ serverId }) => {
      if (serverId && typeof serverId === 'string') {
        socket.join(serverId);
      }
    });

    socket.on('server:leave', ({ serverId }) => {
      if (serverId && typeof serverId === 'string') {
        socket.leave(serverId);
      }
    });

    // Register Chat, Typing, and Presence Handlers (In-call voice chat is handled by LiveKit DataChannels)
    registerChatHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerPresenceHandlers(io, socket);

    // Disconnect cleanup
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.userName} [${socket.id}]`);
      if (onlineUsers.get(socket.userId) === socket.id) {
        onlineUsers.delete(socket.userId);
      }
    });
  });
}

export default initSocketIO;
