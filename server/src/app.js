import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initPassport } from './config/passport.js';
import authRouter from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: CLIENT_URL,
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
