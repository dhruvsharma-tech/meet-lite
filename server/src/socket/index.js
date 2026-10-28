import { parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { registerChatHandlers } from './chatHandlers.js';
import { registerTypingHandlers } from './typingHandlers.js';
import { registerPresenceHandlers } from './presenceHandlers.js';
import { registerVoiceChatHandlers } from './voiceChatHandlers.js';
import {
  createRoom,
  getRoom,
  addUser,
  removeUser,
  findRoomBySocket,
} from '../rooms.js';

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

    // Register Chat, Typing, Presence & Voice Chat Handlers
    registerChatHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerPresenceHandlers(io, socket);
    registerVoiceChatHandlers(io, socket);

    // ─── Legacy Meet-Lite 1-on-1 P2P Handlers (preserved until Step 12) ──────
    socket.on('create-room', (cb) => {
      try {
        const roomId = createRoom();
        if (typeof cb === 'function') cb({ ok: true, roomId });
      } catch {
        if (typeof cb === 'function') cb({ ok: false, error: 'SERVER_ERROR' });
      }
    });

    socket.on('join-room', ({ roomId, name } = {}, cb) => {
      try {
        if (typeof roomId !== 'string') return cb && cb({ ok: false, error: 'ROOM_NOT_FOUND' });
        const room = getRoom(roomId);
        if (!room) return cb && cb({ ok: false, error: 'ROOM_NOT_FOUND' });
        if (room.users.size >= 2) return cb && cb({ ok: false, error: 'ROOM_FULL' });

        const existing = findRoomBySocket(socket.id);
        if (existing) {
          const res = removeUser(socket.id);
          if (res) {
            socket.leave(res.roomId);
            io.to(res.roomId).emit('user-left', { id: socket.id, name: res.name });
          }
        }

        const cleanName = socket.userName || name || 'Guest';
        addUser(roomId, socket.id, cleanName);
        socket.join(roomId);

        const users = [...room.users.entries()].map(([id, u]) => ({ id, name: u.name }));
        if (typeof cb === 'function') cb({ ok: true, users });
        socket.to(roomId).emit('user-joined', { id: socket.id, name: cleanName });
      } catch {
        if (typeof cb === 'function') cb({ ok: false, error: 'SERVER_ERROR' });
      }
    });

    socket.on('offer', (data) => {
      if (!data?.sdp) return;
      const found = findRoomBySocket(socket.id);
      if (found) socket.to(found.roomId).emit('offer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('answer', (data) => {
      if (!data?.sdp) return;
      const found = findRoomBySocket(socket.id);
      if (found) socket.to(found.roomId).emit('answer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('ice-candidate', (data) => {
      if (!data?.candidate) return;
      const found = findRoomBySocket(socket.id);
      if (found) socket.to(found.roomId).emit('ice-candidate', { candidate: data.candidate, from: socket.id });
    });

    // Disconnect cleanup
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.userName} [${socket.id}]`);
      if (onlineUsers.get(socket.userId) === socket.id) {
        onlineUsers.delete(socket.userId);
      }

      // Legacy room cleanup
      const result = removeUser(socket.id);
      if (result) {
        socket.leave(result.roomId);
        io.to(result.roomId).emit('user-left', { id: socket.id, name: result.name });
      }
    });
  });
}

export default initSocketIO;
