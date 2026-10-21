import 'dotenv/config';
import { Server } from 'socket.io';
import app from './src/app.js';
import { registerSocketHandlers } from './src/socket.js';
import { startRoomCleanup } from './src/rooms.js';

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// app.listen returns an http.Server — attach Socket.IO to it
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN },
});

registerSocketHandlers(io);

// Start periodic cleanup of empty rooms
startRoomCleanup();
