# Meet-Lite — 10 to 20 Users Scale & Optimization Plan

Yeh document Meet-Lite ko **10 se 20 users per room** tak smoothly scale karne ka step-by-step optimization roadmap hai.

Is document mein har step ko ek **Ready-to-use Prompt** ke roop mein likha gaya hai. Aap ek-ek prompt copy karke agent ko de sakte hain, aur agent us specific step ko implement aur verify karega.

---

## 📌 Architecture Overview

* **Media SFU:** LiveKit Cloud (No local binaries, deployment-ready for internet use).
* **Signaling & Backend:** Node.js, Express, Socket.IO, Neon PostgreSQL, Prisma.
* **Core Goal:** 10–20 log ek voice/video room mein jud sakein bina laptop hang huye, bina video freeze huye, aur bina audio delay ke.

---

## 🚀 Execution Prompts (Step-by-Step)

---

### 🔹 STEP 1: Media Layer Optimization & Capture Presets

**Objective:** Client-side par LiveKit SFU ke advanced features (`dynacast`, `adaptiveStream`, `simulcast`) aur audio capture options enable karna taaki bandwidth aur CPU consume na ho.

```markdown
### PROMPT FOR STEP 1:

Implement Step 1 of the optimization roadmap: Media Layer Optimization & Capture Presets in `client/src/components/voice/VoiceRoom.jsx` and `client/src/hooks/useLiveKit.js`.

Requirements:
1. In `VoiceRoom.jsx`:
   - Set `adaptiveStream={true}` on `<LiveKitRoom>` so subscribers only pull video resolutions matching their tile's display size.
   - Set `dynacast={true}` on `<LiveKitRoom>` so publishers automatically pause sending video when nobody is watching.
   - Configure `audioCaptureOptions`:
     - `echoCancellation: true` (Acoustic Echo Cancellation)
     - `noiseSuppression: true` (Background Noise Suppression)
     - `autoGainControl: true` (Normalize microphone volume)
   - Configure `videoCaptureOptions`:
     - Default resolution: 360p (640x360) @ 24fps or 30fps as base resolution.
     - Enable `simulcast: true` (180p, 360p, 720p layers).
2. Ensure connection error and reconnecting states are gracefully handled.
3. Verify that `npx vite build` passes without any errors.
```

---

### 🔹 STEP 2: Smart Paginated Participant Grid with Active Speaker Priority

**Objective:** DOM mein 15-20 video elements ek saath render na karke sirf **max 6 se 8 tiles per page** render karna. Active speaker automatically front page par aayega, aur off-screen participants ka video decode stop hoga.

```markdown
### PROMPT FOR STEP 2:

Implement Step 2 of the optimization roadmap: Smart Paginated Participant Grid with Active Speaker Priority in `client/src/components/voice/ParticipantGrid.jsx` and `client/src/components/voice/VideoTile.jsx`.

Requirements:
1. In `ParticipantGrid.jsx`:
   - Maximum visible video tiles per page = 8 (2x4 grid layout) or responsive 6-8 tiles.
   - If total participants > 8, provide a clean pagination control (Previous / Next arrows and page dots e.g., "Page 1 of 2").
   - Sort participants dynamically using LiveKit's active speakers: whoever is currently speaking is prioritized to Page 1 so you always see active speakers.
   - For participants on inactive pages, their video track must NOT be mounted in the DOM (audio continues to play automatically via `<RoomAudioRenderer />`).
2. In `VideoTile.jsx`:
   - Maintain the green speaking border glow when speaking.
   - Show participant name, camera-off avatar placeholder with initials, and microphone mute icon.
3. Test layout responsiveness and verify client build with `npx vite build`.
```

---

### 🔹 STEP 3: In-Call Ephemeral Chat via Native LiveKit Data Channel

**Objective:** Voice call ke dauran hone wali chat ko Socket.IO aur PostgreSQL database se hata kar LiveKit ke native WebRTC Data Channel par daalna. Isse server load aur database I/O bilkul zero ho jayega.

```markdown
### PROMPT FOR STEP 3:

Implement Step 3 of the optimization roadmap: Migrate In-Call Ephemeral Voice Chat to Native LiveKit Data Channels.

Requirements:
1. Update `client/src/hooks/useLiveKit.js` and `client/src/components/voice/VoiceChatPanel.jsx`:
   - When sending a voice chat message, use `room.localParticipant.publishData(payload, { reliable: true })`.
   - Listen for incoming data packets via `room.on(RoomEvent.DataReceived, (payload, participant) => ...)`.
   - Format messages with sender name, sender ID, content, and timestamp.
2. In `server/src/socket/index.js` and `server/src/socket/voiceChatHandlers.js`:
   - Remove or deprecate the redundant Socket.IO voice room event handlers (`voice:join`, `voice:leave`, `voice:message:send`).
   - Keep regular text channel chat intact (Socket.IO + Prisma for persistent channels).
3. Verify both in-call instant chat and persistent channel chat work independently without interference.
```

---

### 🔹 STEP 4: LiveKit Token Service Hardening & Grant Permissions

**Objective:** Backend par LiveKit access token generation ko secure aur production-ready banana, TTL manage karna aur data channel permissions ensure karna.

```markdown
### PROMPT FOR STEP 4:

Implement Step 4 of the optimization roadmap: LiveKit Token Hardening & Grant Permissions in `server/src/services/livekit.service.js` and `server/src/controllers/livekit.controller.js`.

Requirements:
1. In `livekit.service.js`:
   - Set token `ttl` (Time to Live) to `6h` or `12h`.
   - Add explicit grants:
     - `roomJoin: true`
     - `room: channelId`
     - `canPublish: true`
     - `canSubscribe: true`
     - `canPublishData: true` (for in-call chat)
   - Attach user metadata (name, avatar, userId) to the token payload so LiveKit participants have complete profile info.
2. In `livekit.controller.js`:
   - Validate server membership before token issuance.
   - Handle edge cases and return clean error messages if credentials or channels are invalid.
3. Verify server modules with `node -e` check.
```

---

### 🔹 STEP 5: Testing Checklist & Multi-Device Verification Guide

**Objective:** System ko 10–20 users ke scale par locally aur multiple devices par test karne ka complete procedure aur metrics verification.

```markdown
### PROMPT FOR STEP 5:

Implement Step 5 of the optimization roadmap: Final Testing, Diagnostics, and Verification.

Requirements:
1. Verify `chrome://webrtc-internals` parameters:
   - Confirm Simulcast is active (multiple RID streams e.g. q, h, f).
   - Confirm bandwidth and CPU remain stable when adding participants.
2. Add a clear connection quality badge / latency indicator in the voice room header (e.g., Good / Fair / Poor connection based on participant connection quality).
3. Ensure unmount/leave cleanly disconnects the room and stops all local media tracks (no ghost participants left behind).
4. Run full frontend build (`npx vite build`) and confirm git working tree is clean.
```

---

## 📊 Summary of Improvements

| Metric | Before Optimization | After Optimization |
|---|---|---|
| **Max Smooth Participants** | ~2 to 3 users | **10 to 20 users** |
| **Video Decoding in DOM** | All 15-20 decoded at once (Crash) | Max 6-8 per page (Smooth GPU) |
| **Video Resolution** | Uncontrolled 720p/1080p | Adaptive 360p (Simulcast) |
| **In-Call Chat Path** | Socket.IO -> Database -> Socket.IO | WebRTC Data Channel (0ms latency, 0 DB load) |
| **Audio Processing** | Raw browser stream | Opus + Echo Cancellation + Noise Suppression |
| **Deployment Readiness** | Local config messy | 100% Cloud-ready via `.env` variables |
