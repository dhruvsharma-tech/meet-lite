# Meet Lite: Step-by-step Prompts + Git Commits
 
## How to use
 
1. Put `MEET_LITE_IMPLEMENTATION_GUIDE.md` in the root of your repo (the agent will read it in every step).
2. Give the prompts one at a time, in order.
3. After each prompt: run the app, check the **Test** line, then do the **Commit** (`git add . && git commit -m "..."`).
4. If a test fails, ask the agent to fix it before committing. Never move to the next prompt with a broken step.
5. Push to GitHub after every 2-3 commits (`git push`).
## Step 0: Git setup (do this yourself, no agent)
 
```bash
mkdir meet-lite && cd meet-lite
git init
# copy MEET_LITE_IMPLEMENTATION_GUIDE.md here
printf "node_modules\n.env\ndist\n.DS_Store\n" > .gitignore
git add .
git commit -m "docs: add implementation guide"
# create an empty repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/<your-username>/meet-lite.git
git push -u origin main
```
 
---
 
## Prompt 1: Project scaffold (folders + dependencies)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md fully. We will build the project in small steps. Do ONLY
this step and nothing else.
 
Step 1: Create the folder structure exactly as in section 3 of the guide.
- server/: run npm init, set "type": "module", install express, socket.io, cors, dotenv. Add
the dev and start scripts from section 5.5. Create the empty files src/index.js, src/socket.js,
src/rooms.js and .env.example.
- client/: create a Vite React (JavaScript) app, install react-router-dom, socket.io-client,
and set up Tailwind CSS v3 with the standard PostCSS config. Create the empty folders/files
listed in section 3 (pages, components, hooks, socket.js). Add .env.example.
- Add a basic README.md with the project name only.
Do not write any server or app logic yet. At the end, tell me how to verify that both projects
install and start without errors.
```
 
**Test:** `cd server && npm install`, `cd client && npm install && npm run dev` (Vite page opens).
 
**Commit:** `chore: scaffold project structure and install dependencies`
 
---
 
## Prompt 2: Express server + health API
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md. Do ONLY this step.
 
Step 2: In server/src/index.js, create the Express app with:
- dotenv config, PORT and CLIENT_ORIGIN from env (defaults 5000 and http://localhost:5173)
- cors restricted to CLIENT_ORIGIN, express.json()
- GET /health returning { status: "ok" }
- an http.createServer(app) that listens on PORT and logs "Server running on port X"
Create server/.env from .env.example. Do not add Socket.IO yet.
Tell me how to test it.
```
 
**Test:** `npm run dev` in server, open `http://localhost:5000/health` -> `{"status":"ok"}`.
 
**Commit:** `feat(server): add express server with health endpoint`
 
---
 
## Prompt 3: Attach Socket.IO
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md. Do ONLY this step.
 
Step 3: Attach Socket.IO to the existing http server in server/src/index.js with CORS limited
to CLIENT_ORIGIN. Move socket handling into server/src/socket.js: export a function
registerSocketHandlers(io) that, for now, only logs "socket connected: <id>" on connection and
"socket disconnected: <id>" on disconnect. Import and call it from index.js.
No room logic yet. Tell me how to test the connection.
```
 
**Test:** server logs connect/disconnect when you test from Prompt 7's client (or skip test now, it gets verified in Prompt 7).
 
**Commit:** `feat(server): attach socket.io with connection logging`
 
---
 
## Prompt 4: In-memory room store
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md section 5.2. Do ONLY this step.
 
Step 4: Implement server/src/rooms.js with the in-memory Map store and these exported helpers:
createRoom, getRoom, addUser, removeUser, findRoomBySocket, cleanupEmptyRooms. Follow section
5.2 exactly (random id via crypto.randomUUID, users Map, createdAt, lastActive). Also start the
cleanup setInterval (every 5 minutes, deletes empty rooms inactive for 10 minutes), exported as
startRoomCleanup() and called from index.js.
Do not add socket events yet. Write small, clear functions with brief comments.
```
 
**Test:** server still starts without errors.
 
**Commit:** `feat(server): add in-memory room store`
 
---
 
## Prompt 5: Room events (create, join, leave)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 5.3 and 5.4. Do ONLY this step.
 
Step 5: In server/src/socket.js implement these events using acknowledgements, exactly as
specified:
- create-room -> ack { ok: true, roomId }
- join-room { roomId, name } -> validate, max 2 users, socket.join(roomId), ack { ok, users }
or { ok: false, error: "ROOM_NOT_FOUND" | "ROOM_FULL" }, then emit user-joined to the others in
the room
- leave-room and disconnect -> remove the user, emit user-left to the remaining user
Apply the name rules (trim, max 20 chars, default "Guest") and handle bad payloads without
crashing. If a socket joins while already in a room, leave the old room first.
Do not implement chat or signaling yet. Add a tiny temporary script
server/scripts/test-rooms.js using socket.io-client that creates a room with client A, joins with
client B, tries client C (expects ROOM_FULL) and a fake id (expects ROOM_NOT_FOUND), and prints
PASS/FAIL. Tell me how to run it.
```
 
**Test:** run the test script, all PASS.
 
**Commit:** `feat(server): add create, join and leave room events`
 
---
 
## Prompt 6: Chat event (server)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 5.3 and 5.4. Do ONLY this step.
 
Step 6: Add the chat-message event in server/src/socket.js. The server must find the sender's
room with findRoomBySocket (never trust a roomId from the client), validate text (string,
trimmed, not empty, max 500 chars, otherwise ignore), and broadcast chat-message { id, name,
text, time } to everyone in the room INCLUDING the sender. Extend server/scripts/test-rooms.js
to check that both clients receive the message and that an empty message is ignored.
```
 
**Test:** test script passes with the chat checks.
 
**Commit:** `feat(server): add chat message broadcasting`
 
---
 
## Prompt 7: Client base (router, socket, layout)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 6.1 and 6.2. Do ONLY this step.
 
Step 7: Set up the client app:
- client/src/socket.js: the shared socket.io-client instance using VITE_SERVER_URL
- App.jsx with react-router routes: "/" -> Home, "/room/:roomId" -> Room, "*" -> redirect to
"/"
- main.jsx WITHOUT React.StrictMode (explained in section 6.5)
- Home.jsx and Room.jsx as simple placeholders (just a heading each)
- Tailwind working with a clean, simple, mobile-friendly base layout
Create client/.env from .env.example. Log "connected" in the browser console when the socket
connects, to verify the server connection.
```
 
**Test:** open the client, browser console shows `connected`, server logs `socket connected`. Routes `/` and `/room/abc` both open.
 
**Commit:** `feat(client): add router, shared socket and base layout`
 
---
 
## Prompt 8: Home page
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md section 6.3. Do ONLY this step.
 
Step 8: Build Home.jsx as designed in the guide:
- optional name input (saved in localStorage under meetlite_name, wrapped in try/catch)
- "Create room" button: emit create-room, then navigate to /room/<roomId> passing { name } in
navigation state
- an "or" divider
- room ID input + "Join room" button: trim the id, navigate to /room/<id> with { name } in
state
- show an error message if navigation state contains an error from the Room page
(ROOM_NOT_FOUND -> "Room not found", ROOM_FULL -> "Room is full")
Clean Tailwind styling, centered card, mobile friendly. The Room page is still a placeholder.
```
 
**Test:** Create room -> URL changes to `/room/<id>`. Join with an id -> URL changes.
 
**Commit:** `feat(client): add home page with create and join room`
 
---
 
## Prompt 9: Room page + join flow
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 6.4 and 6.5 (only the join part, NO webrtc
yet). Do ONLY this step.
 
Step 9: Build Room.jsx:
- read roomId from the URL and name from location.state (default "Guest")
- on mount emit join-room; on { ok: false } navigate("/") with the error in state; on ok show
the room
- header with Room ID and a Copy button (clipboard + "Copied" feedback)
- placeholder areas for remote video, local video and chat (just boxes with labels)
- listen to user-joined / user-left and show who is in the room ("Waiting for someone to join"
/ "<name> is here")
- cleanup on unmount: emit leave-room and remove ALL listeners with socket.off
Do not add chat, video or WebRTC yet.
```
 
**Test:** two browser windows: A creates, B joins with the id. A sees "B is here". Third window -> back to Home with "Room is full". Wrong id -> "Room not found".
 
**Commit:** `feat(client): add room page with join flow and presence`
 
---
 
## Prompt 10: Chat UI
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 6.4 (chat panel) and 6.6. Do ONLY this step.
 
Step 10: Build components/ChatPanel.jsx and connect it in Room.jsx:
- message list with auto-scroll to bottom, own messages right-aligned with a different
background, others left-aligned with sender name
- system messages ("<name> joined", "<name> left") shown centered and muted
- input + send button, Enter sends, empty messages are ignored
- render text as plain text only (no dangerouslySetInnerHTML)
Messages come from the chat-message socket event; sender is "mine" when id === socket.id.
```
 
**Test:** two windows, messages appear in both, system messages show on join/leave.
 
**Commit:** `feat(client): add realtime chat panel`
 
---
 
## Prompt 11: Local video + controls
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 6.4 and 6.5. Do ONLY this step.
 
Step 11: Create hooks/useWebRTC.js (for now ONLY local media), components/VideoTile.jsx and
components/Controls.jsx:
- getUserMedia({ video: true, audio: true }); if it fails show a clear error "Camera and mic
permission needed"
- local video tile (muted, autoPlay, playsInline, mirrored), srcObject set via ref in useEffect
- Controls: mic toggle, camera toggle (use track.enabled, do not stop tracks), and a red Leave
button that emits leave-room, stops all tracks and navigates to "/"
- stop all tracks on unmount
Move the media logic out of Room.jsx into the hook. No peer connection yet.
```
 
**Test:** own camera shows, mic/camera toggle visibly work, Leave goes home and the camera light turns off.
 
**Commit:** `feat(client): add local video preview and media controls`
 
---
 
## Prompt 12: Signaling relay (server)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 5.3 and 5.4. Do ONLY this step.
 
Step 12: In server/src/socket.js add the relay events offer, answer and ice-candidate. For
each, find the sender's room with findRoomBySocket and forward to the other user only
(socket.to(roomId).emit(event, { sdp or candidate, from: socket.id })). Ignore invalid payloads
without crashing. Extend server/scripts/test-rooms.js so client A sends an offer and client B
receives it with the right "from"; same for answer and ice-candidate.
```
 
**Test:** test script passes.
 
**Commit:** `feat(server): add webrtc signaling relay events`
 
---
 
## Prompt 13: WebRTC call (client)
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md section 6.5 carefully, especially "Who sends the offer"
and "Known pitfalls". Do ONLY this step.
 
Step 13: Extend hooks/useWebRTC.js with the full call flow:
- the user already in the room creates the offer when user-joined arrives; the new user answers
- RTCPeerConnection kept in a useRef with the Google STUN server; add local tracks BEFORE
createOffer
- onicecandidate -> emit ice-candidate; ontrack -> set remoteStream
- queue ICE candidates until the remote description is set, then flush (try/catch)
- track connection state (connecting / connected / failed) and expose it
- show the remote stream in a large VideoTile (not muted); show "Waiting for someone to join"
when there is no remote stream
Do not handle user-left/reconnect yet. Remove nothing from the existing chat or controls.
```
 
**Test:** two browsers (Chrome + Firefox or incognito): both see each other's video and hear audio.
 
**Commit:** `feat(client): implement webrtc one-to-one video call`
 
---
 
## Prompt 14: Leave and reconnect handling
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md section 6.5 pitfalls 6, 7 and 8. Do ONLY this step.
 
Step 14: Make the call robust:
- on user-left: close and null the peer connection, clear remoteStream, go back to the waiting
state, clear queued ICE candidates
- when a new user joins (or the same user refreshes and rejoins) a fresh RTCPeerConnection must
be created and the call must connect again without restarting anything
- the full cleanup on Leave/unmount: close the peer connection, stop tracks, remove every
socket listener
- if connection state becomes "failed", show a message "Connection failed. Try rejoining the
room."
Verify there are no duplicate listeners or duplicate messages after rejoining.
```
 
**Test:** B closes the tab -> A returns to "waiting". B joins again -> the call reconnects. Refresh A -> still works. No duplicate chat messages.
 
**Commit:** `fix(client): handle leave and reconnect cleanly`
 
---
 
## Prompt 15: Polish
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md sections 6.4 and 9. Do ONLY this step. Do not add new
features.
 
Step 15: UI polish and safety:
- responsive layout for mobile and desktop (video on top, chat below on mobile)
- loading/connecting states ("Starting camera...", "Connecting...")
- clear error messages everywhere (permissions, room not found, room full, connection failed)
- disabled/visual state for mic and camera when off
- confirm that chat text is rendered as plain text and no secrets are committed (.env is in
.gitignore)
Fix any console warnings.
```
 
**Test:** go through the guide's test checklist (section 8) on desktop and phone-size window.
 
**Commit:** `style: polish ui, loading states and error messages`
 
---
 
## Prompt 16: README + final check
 
```text
Read MEET_LITE_IMPLEMENTATION_GUIDE.md. Do ONLY this step.
 
Step 16: Write the final README.md: what the project is, features, tech stack, folder
structure, how to run server and client (exact commands, .env setup), how the WebRTC signaling
flow works in 6-8 simple lines, the socket events table, limitations (no auth, no TURN, in-memory
data) and ideas for future improvements (auth, Postgres, TURN, group calls). Then run
through the test checklist in section 8 and list anything that fails. Also remove the temporary
test script only if everything passes, otherwise keep it.
```
 
**Test:** a fresh clone + the README commands runs the app.
 
**Commit:** `docs: add final readme`
 
---
 
## Bonus: Interview talking points (add to README or keep for yourself)
 
- "I built the signaling server with Socket.IO and the media goes peer-to-peer through WebRTC."
- "The existing user creates the offer, the new user answers, and both exchange ICE candidates."
- "I queued ICE candidates until the remote description was set to avoid race conditions."
- "I used STUN locally. In production I would add a TURN server for strict NATs."
- "I intentionally skipped auth to keep scope small. Next I would add JWT and a room password."