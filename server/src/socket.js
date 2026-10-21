import {
  createRoom,
  getRoom,
  addUser,
  removeUser,
  findRoomBySocket,
} from './rooms.js';

// Sanitize name: trim, max 20 chars, default "Guest"
function sanitizeName(name) {
  if (typeof name !== 'string') return 'Guest';
  const trimmed = name.trim().slice(0, 20);
  return trimmed || 'Guest';
}

// Shared cleanup: remove user from rooms and notify the remaining user
function handleLeave(socket, io) {
  const result = removeUser(socket.id);
  if (!result) return;
  const { roomId, name } = result;
  socket.leave(roomId);
  io.to(roomId).emit('user-left', { id: socket.id, name });
}

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    // create-room: make a new room and return its id
    socket.on('create-room', (cb) => {
      try {
        const roomId = createRoom();
        cb({ ok: true, roomId });
      } catch (err) {
        cb({ ok: false, error: 'SERVER_ERROR' });
      }
    });

    // join-room: validate room, enforce 2-user limit, add user, notify others
    socket.on('join-room', ({ roomId, name } = {}, cb) => {
      try {
        if (typeof roomId !== 'string') return cb({ ok: false, error: 'ROOM_NOT_FOUND' });

        const room = getRoom(roomId);
        if (!room) return cb({ ok: false, error: 'ROOM_NOT_FOUND' });
        if (room.users.size >= 2) return cb({ ok: false, error: 'ROOM_FULL' });

        // If already in a room, leave it first
        const existing = findRoomBySocket(socket.id);
        if (existing) handleLeave(socket, io);

        const cleanName = sanitizeName(name);
        addUser(roomId, socket.id, cleanName);
        socket.join(roomId);

        // Build user list for the ack
        const users = [...room.users.entries()].map(([id, u]) => ({ id, name: u.name }));

        cb({ ok: true, users });

        // Notify everyone else in the room
        socket.to(roomId).emit('user-joined', { id: socket.id, name: cleanName });
      } catch (err) {
        cb({ ok: false, error: 'SERVER_ERROR' });
      }
    });

    // leave-room: explicit leave button
    socket.on('leave-room', () => {
      handleLeave(socket, io);
    });

    // disconnect: browser tab closed / network drop
    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
      handleLeave(socket, io);
    });
  });
}
