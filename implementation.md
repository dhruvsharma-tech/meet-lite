# Meet Lite: Backend + Implementation Guide
 
This document is the single source of truth for building Meet Lite, a small room-based app with realtime chat and a 1-to-1 video call. Read the whole file before writing code. Follow the build phases in order and do not skip the checkpoints.
 
## 1. What we are building
 
A web app with two pages:
 
1. **Home page:** user can Create room or Join room (by entering a room ID). No login, no signup.
2. **Room page:** shows remote video, own video preview, mic/camera/leave controls, participant info, and a chat panel.
### Rules of the product
 
- No authentication. Anyone who has a valid room ID can join. The random room ID is the only "secret".
- **Create room:** the creator is immediately inside the room (they do NOT type the ID again). The room ID is shown on screen with a copy button.
- **Join room:** second user types the room ID and joins.
- Max 2 users per room. A third user gets "Room is full".
- No database. All room data lives in server memory.
- Runs locally only for now. No deployment, no TURN server.
### Out of scope (do NOT build)
 
Login/signup, database, group calls (3+ users), recording, screen share, waiting room, TypeScript, Redux, Docker, tests, deployment.
 
## 2. Tech stack (fixed, do not substitute)
 
| Part | Choice |
|---|---|
| Frontend | React 18 + Vite, JavaScript (not TypeScript) |
| Styling | Tailwind CSS (v3 via PostCSS, the standard setup) |
| Routing | react-router-dom v6 |
| Realtime client | socket.io-client |
| Backend | Node.js (18+) + Express |
| Realtime server | socket.io |
| Video/audio | Native browser WebRTC (`RTCPeerConnection`, `getUserMedia`). Do not use PeerJS or simple-peer. |
| STUN | `stun:stun.l.google.com:19302` |
| Package manager | npm |
| Env | dotenv on server, `import.meta.env` on client |
 
Use stable, widely used package versions. Do not use experimental or beta versions. Do not add libraries that are not listed here without a strong reason.
 
## 3. Folder structure
 
```
meet-lite/
  README.md
  server/
    package.json
    .env.example
    src/
      index.js        # Express + HTTP server + Socket.IO setup
      socket.js       # all socket event handlers
      rooms.js        # in-memory room store + helper functions
  client/
    package.json
    index.html
    vite.config.js
    tailwind.config.js
    postcss.config.js
    .env.example
    src/
      main.jsx
      App.jsx         # routes
      index.css       # tailwind directives
      socket.js       # single shared socket.io client instance
      pages/
        Home.jsx
        Room.jsx
      components/
        VideoTile.jsx
        Controls.jsx
        ChatPanel.jsx
      hooks/
        useWebRTC.js  # all WebRTC + signaling logic
```
 
Keep files small and single-purpose. All WebRTC logic lives in `useWebRTC.js`, NOT inside components.
 
## 4. Environment variables
 
`server/.env.example`
 
```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```
 
`client/.env.example`
 
```
VITE_SERVER_URL=http://localhost:5000
```
 
Server CORS (both Express and Socket.IO) must allow only `CLIENT_ORIGIN`.
 
## 5. Backend
 
### 5.1 REST API
 
Only one HTTP endpoint is needed:
 
| Method | Path | Response |
|---|---|---|
| GET | `/health` | `{ "status": "ok" }` |
 
Everything else happens over Socket.IO.
 
### 5.2 In-memory room store (`rooms.js`)
 
```js
// Map<roomId, { users: Map<socketId, { name }>, createdAt: number, lastActive: number }>
const rooms = new Map();
```
 
Helper functions to export:
 
- `createRoom()`: generates roomId with `crypto.randomUUID()` (Node built-in; use the first 8 characters or a short readable id, but it must stay random and not guessable), stores an empty room, returns `roomId`.
- `getRoom(roomId)`
- `addUser(roomId, socketId, name)`
- `removeUser(socketId)`: finds the room the socket was in, removes the user, returns `{ roomId, name }` or `null`.
- `findRoomBySocket(socketId)`
- `cleanupEmptyRooms()`: delete rooms with 0 users whose `lastActive` is older than 10 minutes. Run it with `setInterval` every 5 minutes.
### 5.3 Socket events (this is the API)
 
All client-to-server events that expect a result use Socket.IO acknowledgements (callback as last argument). Always respond to the callback, also on errors.
 
#### Client -> Server
 
| Event | Payload | Ack response | What the server does |
|---|---|---|---|
| `create-room` | none | `{ ok: true, roomId }` | Creates an empty room, returns its id |
| `join-room` | `{ roomId, name }` | `{ ok: true, users: [{ id, name }] }` or `{ ok: false, error: "ROOM_NOT_FOUND" \| "ROOM_FULL" }` | Validates, adds socket to the room (`socket.join(roomId)`), notifies others |
| `chat-message` | `{ text }` | none | Validates, broadcasts to the room |
| `offer` | `{ sdp }` | none | Forwards to the other user in the room |
| `answer` | `{ sdp }` | none | Forwards to the other user in the room |
| `ice-candidate` | `{ candidate }` | none | Forwards to the other user in the room |
| `leave-room` | none | none | Same cleanup as disconnect |
 
#### Server -> Client
 
| Event | Payload | Meaning |
|---|---|---|
| `user-joined` | `{ id, name }` | Sent to users already in the room when someone new joins |
| `user-left` | `{ id, name }` | Sent to remaining user when the other leaves or disconnects |
| `chat-message` | `{ id, name, text, time }` | A chat message (also sent back to the sender so the UI has a single source) |
| `offer` | `{ sdp, from }` | Relay |
| `answer` | `{ sdp, from }` | Relay |
| `ice-candidate` | `{ candidate, from }` | Relay |
 
### 5.4 Server rules
 
- `name`: trim, max 20 chars, default to `"Guest"` if empty.
- `roomId`: must be a string, otherwise respond `ROOM_NOT_FOUND`.
- `chat-message.text`: must be a non-empty string after trim, max 500 chars, else ignore silently. The sender must be in a room; the server decides the room from its own records (use `findRoomBySocket`), never trust a roomId sent with the message.
- Signaling relay (`offer`, `answer`, `ice-candidate`): find the sender's room with `findRoomBySocket`, then forward to the other socket in that room only (`socket.to(roomId).emit(...)`).
- A socket can be in only one room at a time. If it calls `join-room` while already in one, leave the old one first.
- `disconnect` event: run the same cleanup as `leave-room`, emit `user-left` to the remaining user, update `lastActive`.
- Do not crash on bad payloads. Wrap handlers in checks, never let an exception take the server down.
### 5.5 Server setup notes
 
- Create the HTTP server with `http.createServer(app)` and attach Socket.IO to it.
- `cors({ origin: CLIENT_ORIGIN })` for Express and `new Server(httpServer, { cors: { origin: CLIENT_ORIGIN } })` for Socket.IO.
- Use ES modules (`"type": "module"` in `package.json`) consistently across the server.
- Add scripts: `"dev": "node --watch src/index.js"`, `"start": "node src/index.js"`.
## 6. Frontend
 
### 6.1 Routes
 
| Path | Page |
|---|---|
| `/` | Home |
| `/room/:roomId` | Room |
| `*` | redirect to `/` |
 
### 6.2 Shared socket (`client/src/socket.js`)
 
Create one socket instance and export it:
 
```js
import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_SERVER_URL, { autoConnect: true });
```
 
### 6.3 Home page
 
- Optional name input (stored in `localStorage` under `meetlite_name`, wrap access in try/catch).
- **Create room** button: `socket.emit("create-room", cb)` -> on `ok`, `navigate("/room/" + roomId, { state: { name } })`.
- Divider "or".
- Room ID input + **Join room** button: trim the input, navigate to `/room/<id>` with the name in state. The Room page performs the actual `join-room` and shows errors.
- If Room page redirects back with an error (room not found / full), show a clear message on Home (pass via navigation state).
### 6.4 Room page layout (mobile friendly, simple)
 
1. **Header:** `Room ID: <id>` + Copy button (`navigator.clipboard.writeText`) + brief "Copied" feedback.
2. **Remote video tile** (large). When nobody else is in the room, show text "Waiting for someone to join. Share the room ID."
3. **Local video tile** (small, bottom-right overlay), muted, mirrored.
4. **Controls:** mic toggle, camera toggle, leave (red).
5. **Chat panel:** message list (auto-scroll to bottom), system messages ("X joined", "X left"), input + send button (Enter also sends).
Render chat text as plain text only. Never use `dangerouslySetInnerHTML`.
 
If `location.state` has no name (user opened the link directly), use `"Guest"`.
 
### 6.5 `useWebRTC(roomId, name)` hook (core logic)
 
The hook owns: local stream, remote stream, peer connection, signaling listeners, chat messages, mic/camera state, error state. It returns something like:
 
```js
{ localStream, remoteStream, messages, sendMessage, micOn, camOn, toggleMic, toggleCam, leave, status, error, peerName }
```
 
#### Flow (implement exactly this)
 
**On mount (inside one `useEffect` with proper cleanup):**
 
1. Call `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`. If it fails, set an error ("Camera/mic permission needed") and stop. Do not join the room without media.
2. Register all socket listeners (`user-joined`, `user-left`, `offer`, `answer`, `ice-candidate`, `chat-message`).
3. Emit `join-room` with `{ roomId, name }`. On `ok: false`, set error and navigate home with the error code.
4. On `ok: true`: if `users` already contains another person (this client is the second user), do nothing yet and wait for the offer (the first user starts the call).
#### Who sends the offer
 
The user already in the room creates the offer. When the existing user receives `user-joined`:
 
1. Create a new `RTCPeerConnection` (config: `iceServers: [{ urls: "stun:stun.l.google.com:19302" }]`).
2. Add all local tracks: `localStream.getTracks().forEach(t => pc.addTrack(t, localStream))` (before `createOffer`).
3. `pc.createOffer()` -> `pc.setLocalDescription(offer)` -> `socket.emit("offer", { sdp: pc.localDescription })`.
When the new user receives `offer`:
 
1. Create a new `RTCPeerConnection`, add local tracks.
2. `setRemoteDescription(offer)`, flush queued ICE candidates (see below).
3. `createAnswer()` -> `setLocalDescription(answer)` -> `emit("answer", { sdp })`.
When the first user receives `answer`: `setRemoteDescription(answer)`, flush queued ICE candidates.
 
#### Peer connection handlers
 
```js
pc.onicecandidate = e => e.candidate && socket.emit("ice-candidate", { candidate: e.candidate })
pc.ontrack = e => setRemoteStream(e.streams[0])
```
 
`pc.onconnectionstatechange`: update `status` (`connecting`, `connected`, `disconnected`, `failed`).
 
#### Known pitfalls (handle all of them)
 
1. ICE candidates arriving before the remote description is set will throw errors. Keep a queue: if `pc.remoteDescription` is null, push the candidate into an array; after `setRemoteDescription`, add all queued candidates with `pc.addIceCandidate`. Wrap in try/catch.
2. React 18 StrictMode runs effects twice in development. This causes duplicate socket listeners and double joins. Remove `<React.StrictMode>` from `main.jsx` to avoid this, and still write a proper cleanup function that removes every listener with `socket.off(...)`, closes the peer connection, and stops all local tracks.
3. Add tracks before creating the offer, otherwise the call connects with no video.
4. Local video element must be `muted` and `autoPlay playsInline`, otherwise you hear an echo and some browsers block autoplay. The remote video is `autoPlay playsInline` (not muted).
5. Set `video.srcObject` in a `useEffect`/ref, not as a prop.
6. On `user-left`: close the peer connection, set it to null, clear remote stream, show "waiting" state again, add a system chat message. When someone new joins (or the same person refreshes and rejoins), a fresh peer connection must be created.
7. Mic/camera toggle: use `track.enabled = !track.enabled` on the local audio/video tracks. Do not stop the tracks (stopping makes re-enabling hard).
8. Leave: emit `leave-room`, close the peer connection, stop all tracks (`track.stop()`), disconnect listeners, `navigate("/")`.
9. `getUserMedia` only works on localhost or HTTPS. For local testing use `http://localhost:5173`.
10. Do not store the `RTCPeerConnection` in React state. Keep it in a `useRef`.
### 6.6 Chat
 
- `sendMessage(text)`: trim, ignore empty, `socket.emit("chat-message", { text })`.
- Incoming `chat-message` events are appended to `messages`. Mark messages with `id === socket.id` as "mine" (right aligned, different background).
- System messages (joined/left) are local entries with `type: "system"`.
## 7. Build phases (follow in order, verify each checkpoint)
 
### Phase 1: Project setup
 
Create server and client folders, install dependencies, configure Tailwind.
 
**Checkpoint:** `GET /health` returns `{ status: "ok" }`, and the client page shows a styled "Meet Lite" heading.
 
### Phase 2: Rooms + chat (no video yet)
 
Implement `rooms.js`, `create-room`, `join-room`, `chat-message`, `user-joined`, `user-left`. Build Home page and the Room page with chat only.
 
**Checkpoint:** open two browser windows. Window A creates a room and lands in it. Window B joins with the ID. Messages appear in both. Third window gets "Room is full". Wrong ID shows "Room not found".
 
### Phase 3: Local video
 
Add `getUserMedia`, show the local preview, mic/camera toggles.
 
**Checkpoint:** own video shows, mute and camera-off buttons work.
 
### Phase 4: WebRTC call
 
Add offer/answer/ICE relay on the server and the full flow in `useWebRTC`.
 
**Checkpoint:** two windows see each other's video and hear audio. Closing one window shows the "waiting" state in the other. Rejoining reconnects the call.
 
### Phase 5: Polish
 
Copy-room-ID button, error messages, loading/connecting states, leave button, responsive layout. README with run instructions.
 
**Checkpoint:** run through the full test checklist below.
 
## 8. Test checklist
 
- [ ] Create room puts the creator inside the room directly
- [ ] Room ID is shown and the copy button works
- [ ] Joining with a valid ID works, with an invalid ID shows "Room not found"
- [ ] Third user gets "Room is full"
- [ ] Chat messages appear on both sides in the right order
- [ ] "X joined" and "X left" system messages show up
- [ ] Video and audio work both ways
- [ ] Mic and camera toggles work and the remote side sees the effect
- [ ] Leave button returns to Home and the other user sees the waiting state
- [ ] Refreshing a tab and rejoining reconnects the call without restarting the server
- [ ] No errors in the browser console or server logs during all of the above
**Testing tip:** use two different browsers (for example Chrome and Firefox) or one normal and one incognito window, because some systems do not let two tabs of the same browser use the camera at the same time.
 
## 9. Security (kept intentionally small)
 
1. Room IDs are random and not guessable (`crypto.randomUUID()`), never sequential.
2. Maximum 2 users per room, enforced on the server.
3. Chat text is length-limited on the server and rendered as plain text on the client.
4. CORS restricted to the client origin.
5. The server never trusts client-sent room IDs for chat/signaling, it uses its own record of which room a socket is in.
**Mentioned limitations (for the README):** no authentication, no TURN server (so calls may fail behind strict NATs), data is in memory so a server restart clears all rooms.
 
## 10. Rules for the AI agent
 
- Build one phase at a time, run it, and confirm the checkpoint before continuing.
- Do not add features, libraries, or folders that are not described here.
- Keep code simple and readable, with short comments only where the logic is not obvious (especially WebRTC steps).
- If something is unclear, choose the simplest option that matches this document and mention the choice in the README.
- Never leave placeholder or TODO code in a finished phase.