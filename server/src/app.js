import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ─── API Routes (stubs — controllers wired in upcoming steps) ─────────────────

// Step 3: Auth
// import authRouter from './routes/auth.routes.js';
// app.use('/api/auth', authRouter);

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
