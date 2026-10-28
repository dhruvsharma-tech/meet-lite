// Ephemeral in-memory voice chat: Map<channelId, Message[]>
const voiceMessages = new Map();
// Track participants per voice room: Map<channelId, Set<socketId>>
const voiceParticipants = new Map();

export function registerVoiceChatHandlers(io, socket) {
  // voice:join — socket joins voice room, broadcasts user-joined
  socket.on('voice:join', ({ channelId }, cb) => {
    if (!channelId) return;

    const room = `voice:${channelId}`;
    socket.join(room);

    if (!voiceParticipants.has(channelId)) {
      voiceParticipants.set(channelId, new Set());
    }
    voiceParticipants.get(channelId).add(socket.id);

    io.to(room).emit('voice:user-joined', {
      userId: socket.userId,
      name: socket.userName,
      socketId: socket.id,
    });

    if (typeof cb === 'function') {
      cb({ messages: voiceMessages.get(channelId) || [] });
    }
  });

  // voice:leave — socket leaves voice room, broadcasts user-left
  socket.on('voice:leave', ({ channelId }) => {
    if (!channelId) return;
    _leaveVoiceRoom(io, socket, channelId);
  });

  // voice:message:send — ephemeral message, broadcast to room
  socket.on('voice:message:send', ({ channelId, content }) => {
    if (!channelId || !content?.trim()) return;

    const sanitized = String(content).slice(0, 500);
    const message = {
      id: `${Date.now()}-${socket.id}`,
      userId: socket.userId,
      name: socket.userName,
      content: sanitized,
      createdAt: new Date().toISOString(),
    };

    if (!voiceMessages.has(channelId)) {
      voiceMessages.set(channelId, []);
    }
    voiceMessages.get(channelId).push(message);

    io.to(`voice:${channelId}`).emit('voice:message:new', { channelId, message });
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    for (const [channelId, participants] of voiceParticipants.entries()) {
      if (participants.has(socket.id)) {
        _leaveVoiceRoom(io, socket, channelId);
        break;
      }
    }
  });
}

function _leaveVoiceRoom(io, socket, channelId) {
  const room = `voice:${channelId}`;
  socket.leave(room);

  const participants = voiceParticipants.get(channelId);
  if (participants) {
    participants.delete(socket.id);

    // Clear ephemeral messages when room is empty
    if (participants.size === 0) {
      voiceParticipants.delete(channelId);
      voiceMessages.delete(channelId);
    }
  }

  io.to(room).emit('voice:user-left', {
    userId: socket.userId,
    name: socket.userName,
    socketId: socket.id,
  });
}

