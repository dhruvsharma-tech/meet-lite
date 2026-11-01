# Meet Lite

A modern, high-performance real-time community communication platform inspired by Discord. Built for seamless team collaboration, low-latency group voice/video rooms, screen sharing, persistent channel-based chat, and granular server management.

---

## ✨ Features

### 🎙️ Multi-User Voice & Video Rooms
- **SFU-Powered Media Streaming**: Low-latency multi-participant voice, high-definition video, and screen sharing powered by LiveKit Cloud SFU.
- **Active Speaker & Grid Layout**: Dynamic participant grid prioritizing current speakers and active video streams with auto-paginated layouts.
- **Media Toggles**: Instant microphone mute/unmute, webcam toggle, and screen share controls with real-time audio visualizers.

### 💬 Real-Time Text Channels & Chat
- **Instant Messaging**: Channel-based persistent messaging with real-time delivery via Socket.IO.
- **Live Typing Indicators & Presence**: See who is typing in real time and view online/offline status dots across the member sidebar.
- **Auto-Scrolling & Timestamps**: Clean Discord-themed chat bubbles, date dividers, and auto-scroll to the newest messages.

### 🏰 Server & Channel Architecture
- **Community Servers**: Create custom servers with custom icons and invite codes.
- **Text & Voice Channels**: Organized channels categorized by communication type (`TEXT` and `VOICE`).
- **Role-Based Permissions**: Distinct Owner and Member roles with administrative controls to manage channels, kick members, or delete servers.
- **Shareable Invite Links**: Generate and copy direct server invite links (`/invite/:code`) for quick onboarding.

### 🔐 Authentication & Security
- **Secure Auth**: Email & password authentication with `bcryptjs` password hashing and HTTP-Only JWT cookies.
- **Cross-Origin & Proxy Ready**: Built-in `SameSite=None; Secure` support and `trust proxy` for seamless production deployment across separate frontend/backend domains.
- **Google OAuth Support**: Optional one-click Google Sign-In integration via Passport.js.

### 🎨 Modern Discord-Inspired UI
- **Responsive Dark Theme**: Polished dark aesthetic with custom scrollbars, subtle cosmic particle background, and fluid responsive design.
- **Smooth Animations**: GSAP-driven interactive landing page, intuitive modal overlays, and toast feedback via `react-hot-toast`.

---

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v3, React Router 7, Zustand, Lucide React, GSAP |
| **Backend** | Node.js (ES Modules), Express 5, Socket.IO, Passport.js |
| **Database & ORM** | PostgreSQL (Neon Serverless), Prisma ORM |
| **Media & Audio SFU**| LiveKit Cloud SFU (`livekit-client`, `livekit-server-sdk`) |
| **Storage (Optional)**| Cloudinary (Avatar uploads) |

---

## 📁 Project Structure

```text
meet-lite/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── public/
│   │   ├── _redirects         # SPA redirect fallback for Netlify/Cloudflare
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # ProtectedRoute, Auth guards
│   │   │   ├── channel/       # ChannelSidebar, ChannelItem, MemberList
│   │   │   ├── chat/          # ChatPanel, MessageList, MessageInput
│   │   │   ├── common/        # ConfirmModal, UI dialogs
│   │   │   ├── server/        # ServerList, ServerIcon, CreateServerModal, InviteModal
│   │   │   └── voice/         # VoiceRoom, ParticipantGrid, Controls, TrackTile
│   │   ├── hooks/             # useLiveKit signaling & track hooks
│   │   ├── pages/             # LandingPage, LoginPage, RegisterPage, AppPage, InvitePage
│   │   ├── services/          # Axios API layer (auth, server, channel)
│   │   ├── store/             # Zustand stores (authStore, serverStore, uiStore)
│   │   ├── socket.js          # Singleton Socket.IO client
│   │   ├── App.jsx            # Application routing
│   │   └── main.jsx           # Entry point
│   ├── vercel.json            # Vercel SPA routing configuration
│   └── vite.config.js         # Vite configuration with proxy & tunnel support
│
├── server/                     # Backend API & WebSocket Server
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL database schema (Users, Servers, Channels, Messages)
│   │   └── migrations/        # Prisma migration history
│   ├── src/
│   │   ├── config/            # Passport & OAuth configurations
│   │   ├── controllers/       # Auth, Server, Channel, Message, Invite, Member, LiveKit controllers
│   │   ├── middleware/        # JWT authMiddleware, role checks, errorHandler
│   │   ├── routes/            # Express REST route handlers
│   │   ├── services/          # LiveKit token generator, Cloudinary upload helper
│   │   ├── socket/            # Chat, typing, presence, and voice channel socket handlers
│   │   ├── app.js             # Express application & CORS setup
│   │   └── prisma.js          # Prisma Client singleton
│   ├── server.js              # HTTP server & Socket.IO initialization
│   └── package.json           # Backend dependencies and scripts
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL Database](https://neon.tech) (Free serverless PostgreSQL from Neon)
- [LiveKit Cloud Account](https://livekit.io/) (Free tier available for SFU voice & video)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   *Required variables in `server/.env`:*
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
   JWT_SECRET=your_super_secret_jwt_key
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   LIVEKIT_URL=wss://your-project.livekit.cloud
   NODE_ENV=development
   ```

4. Initialize database schema:
   ```bash
   npx prisma db push
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API and WebSocket server will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Required variables in `client/.env`:*
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🌐 Production Deployment

### Frontend (Vercel)
- Connect your GitHub repository to [Vercel](https://vercel.com).
- Set **Root Directory** to `client`.
- Add Environment Variables:
  - `VITE_API_URL` = `https://your-backend.onrender.com`
  - `VITE_SOCKET_URL` = `https://your-backend.onrender.com`
  - `VITE_LIVEKIT_URL` = `wss://your-project.livekit.cloud`
- The included `client/vercel.json` and `client/public/_redirects` automatically handle client-side routing.

### Backend (Render / Railway)
- Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
- Set **Root Directory** to `server`.
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Add production environment variables (`DATABASE_URL`, `JWT_SECRET`, `LIVEKIT_*`, `CLIENT_URL=https://your-app.vercel.app`, `NODE_ENV=production`).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
