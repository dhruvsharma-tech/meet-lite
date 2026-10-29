/**
 * @deprecated
 * Voice in-call chat is now handled natively via LiveKit WebRTC DataChannels (RoomEvent.DataReceived / publishData),
 * eliminating redundant Socket.IO signaling and memory overhead on the Node server.
 * 
 * Persistent channel messages continue to be handled via chatHandlers.js.
 */
export function registerVoiceChatHandlers() {
  // No-op: in-call messaging has been migrated to LiveKit DataChannels
}

export default registerVoiceChatHandlers;
