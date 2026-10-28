export function registerTypingHandlers(io, socket) {
  // Start typing indicator
  socket.on('typing:start', ({ channelId }) => {
    if (!channelId || typeof channelId !== 'string') return;

    socket.to(channelId).emit('typing:update', {
      channelId,
      userId: socket.userId,
      name: socket.userName || 'User',
      isTyping: true,
    });
  });

  // Stop typing indicator
  socket.on('typing:stop', ({ channelId }) => {
    if (!channelId || typeof channelId !== 'string') return;

    socket.to(channelId).emit('typing:update', {
      channelId,
      userId: socket.userId,
      name: socket.userName || 'User',
      isTyping: false,
    });
  });
}
