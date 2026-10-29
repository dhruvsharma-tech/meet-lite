import { AccessToken } from 'livekit-server-sdk';

/**
 * Generate a cryptographically signed, short-lived JWT room access token.
 * 
 * @param {Object} params
 * @param {string} params.channelId - Target voice channel ID (used as LiveKit room name)
 * @param {string} params.userId - Authenticated user ID (LiveKit participant identity)
 * @param {string} params.userName - Display name
 * @param {string} [params.userAvatar] - Avatar URL if available
 * @param {string} [params.ttl] - Expiry string e.g. '6h'
 * @returns {Promise<string>} Signed JWT token
 */
export async function generateLiveKitToken({
  channelId,
  userId,
  userName,
  userAvatar = null,
  ttl = '6h',
}) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit credentials (LIVEKIT_API_KEY, LIVEKIT_API_SECRET) are not configured in environment');
  }

  // Create access token with 6-hour TTL and user profile metadata
  const token = new AccessToken(apiKey, apiSecret, {
    identity: String(userId),
    name: userName || 'User',
    ttl,
    metadata: JSON.stringify({
      userId: String(userId),
      name: userName || 'User',
      avatar: userAvatar,
    }),
  });

  // Explicit grants for 10-20 user group calling
  token.addGrant({
    roomJoin: true,
    room: String(channelId),
    canPublish: true,      // Publish audio & video (with client-side simulcast)
    canSubscribe: true,    // Subscribe to other participants
    canPublishData: true,  // Send native WebRTC data packets for in-call chat
  });

  return await token.toJwt();
}

export default {
  generateLiveKitToken,
};
