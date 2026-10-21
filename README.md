# Meet Lite

A minimal, high-performance 1-on-1 video calling application with real-time text chat, powered by pure Peer-to-Peer (P2P) WebRTC and Socket.IO signaling.

---

## Features

- **Instant 1-on-1 Video Calling**: Low-latency, direct browser-to-browser media streaming via WebRTC.
- **Real-Time Chat**: Live messaging alongside video with auto-scrolling, distinct bubbles for own vs. peer messages, and plain-text sanitization.
- **System Presence Notifications**: Instant alerts when a peer joins or leaves the room.
- **Media Controls**: Seamless mic mute/unmute and camera toggle without restarting streams.
- **Clean Disconnect & Rejoin Handling**: Reconnection recovery when a participant refreshes or rejoins, reverting to a waiting state when a peer leaves.
- **Strict 2-User Room Limit**: Enforced server-side (`ROOM_FULL`) to maintain P2P mesh performance without heavy server infrastructure.
- **Responsive Layout**: Mobile-friendly interface (video on top, chat below, floating controls with collision-free local video preview).

---

## Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Tailwind CSS v3
- **Backend**: Node.js (ES Modules), Express 5, Socket.IO
- **Real-Time Protocols**: WebRTC (`RTCPeerConnection`), WebSocket (`socket.io`)
- **STUN Server**: Google Public STUN (`stun:stun.l.google.com:19302`)

---

## Project Structure

```text
meet-lite/
├── server/
│   ├── src/
│   │   ├── app.js         # Express app config, CORS & health endpoint
│   │   ├── rooms.js       # In-memory room store & auto-cleanup logic
│   │   └── socket.js      # Socket.IO handlers & WebRTC signaling relay
│   ├── server.js          # HTTP server & Socket.IO initialization
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx   # Realtime chat message list & input
│   │   │   ├── Controls.jsx    # Mic/camera toggles & red Leave button
│   │   │   └── VideoTile.jsx   # Video stream renderer with fallback avatar
│   │   ├── hooks/
│   │   │   └── useWebRTC.js    # Core WebRTC lifecycle, media & signaling
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page, name input, create/join room
│   │   │   └── Room.jsx        # Video viewport, chat layout & connection status
│   │   ├── socket.js           # Shared socket.io-client instance
│   │   ├── App.jsx             # React router & base layout
│   │   └── main.jsx            # Entry point (StrictMode disabled for WebRTC)
│   ├── package.json
│   └── .env.example
├── prompt.md
├── implementation.md
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 2. Setup Server

```bash
cd server
npm install
cp .env.example .env
npm start
```
*Server will start on `http://localhost:5000` (verifiable via `http://localhost:5000/health`).*

### 3. Setup Client

In a separate terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```
*Client will be available at `http://localhost:5173`.*

---

## WebRTC Signaling Flow (How It Works)

1. **User A creates a room** (`create-room`), gets a random 8-character ID, and enters the room.
2. **User B enters the room** (`join-room`). The server acknowledges and notifies User A (`user-joined`).
3. **User A creates an SDP Offer**: Adds local media tracks, calls `pc.createOffer()`, sets local description, and relays it to User B.
4. **User B receives the Offer**: Sets remote description, adds local tracks, creates an SDP Answer (`pc.createAnswer()`), sets local description, and relays it back.
5. **User A receives the Answer**: Sets remote description.
6. **ICE Candidates are exchanged**: Both peers gather network routes via Google STUN and send `ice-candidate` events through the server.
7. **Direct P2P Media Established**: Browsers establish a direct, encrypted audio/video peer connection bypassing the server.

---

## Socket Events Reference

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `create-room` | Client ➔ Server | `cb({ ok, roomId })` | Generates a new random room ID |
| `join-room` | Client ➔ Server | `{ roomId, name }, cb` | Adds user to room (max 2), returns participant list |
| `user-joined` | Server ➔ Client | `{ id, name }` | Informs existing user that a peer has joined |
| `user-left` | Server ➔ Client | `{ id, name }` | Informs remaining user that the peer has disconnected |
| `chat-message` | Bidirectional | `{ id, name, text, time }` | Broadcasts validated chat text to everyone in the room |
| `offer` | Bidirectional (Relay) | `{ sdp, from }` | Relays WebRTC SDP Offer to the other peer |
| `answer` | Bidirectional (Relay) | `{ sdp, from }` | Relays WebRTC SDP Answer to the other peer |
| `ice-candidate` | Bidirectional (Relay) | `{ candidate, from }` | Relays network routing candidates |
| `leave-room` | Client ➔ Server | `none` | Explicitly removes user from the active room |

---

## Architectural Limitations

- **No TURN Server**: Only uses Google STUN. Call connectivity may fail if both peers are behind symmetric NATs or strict corporate firewalls.
- **No User Authentication**: Uses anonymous sessions with optional display names.
- **In-Memory State**: Room records are kept in memory (a server restart resets all active rooms).
- **Max 2 Participants**: Designed exclusively for 1-on-1 calls to avoid the exponential bandwidth and CPU overhead of a full mesh topology.

---

## Future Improvements

- [ ] **TURN Server Integration**: Add Coturn or Xirsys for guaranteed relay fallback.
- [ ] **Authentication & Security**: Add JWT or room access passwords.
- [ ] **Persistent Storage**: Back rooms with Redis or PostgreSQL.
- [ ] **SFU Architecture**: Migrate to mediasoup or LiveKit to support group calls with 3+ users efficiently.
- [ ] **Screen Sharing**: Add `getDisplayMedia` support for desktop screen capture.

---

