import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import { initSocketIO } from './src/socket/index.js';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');

// Create HTTP server from Express app
const httpServer = createServer(app);

// Attach Socket.IO — flexible CORS in dev
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) ||
        origin === CLIENT_URL ||
        origin.endsWith('.trycloudflare.com')
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Initialize modern Socket.IO auth & handlers
initSocketIO(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
