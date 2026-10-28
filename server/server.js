import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { registerSocketHandlers } from './src/socket.js';
import { startRoomCleanup } from './src/rooms.js';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO — CORS must match Express CORS exactly
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

registerSocketHandlers(io);

// Start periodic cleanup of empty rooms (legacy P2P — deprecated in Step 12)
startRoomCleanup();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
