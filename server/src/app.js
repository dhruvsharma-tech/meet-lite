import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initPassport } from './config/passport.js';
import authRouter from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

// ─── Flexible CORS for Development & Production ───────────────────────────────

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport & Strategies
initPassport();
app.use(passport.initialize());

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

// Step 3: Auth
app.use('/api/auth', authRouter);

// Step 5: Servers & Channels
// import serverRouter from './routes/server.routes.js';
// import channelRouter from './routes/channel.routes.js';
// app.use('/api/servers', serverRouter);
// app.use('/api/channels', channelRouter);

// Step 9: Invites & Members
// import inviteRouter from './routes/invite.routes.js';
// app.use('/api/invites', inviteRouter);

// Step 10: LiveKit
// import livekitRouter from './routes/livekit.routes.js';
// app.use('/api/livekit', livekitRouter);

// ─── Global Error Handler (must be last) ──────────────────────────────────────

app.use(errorHandler);

export default app;
