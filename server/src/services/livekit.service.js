import { AccessToken } from 'livekit-server-sdk';

export function generateLiveKitToken({ channelId, userId, userName }) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit API credentials not configured');
  }

  const token = new AccessToken(apiKey, apiSecret, {
    identity: String(userId),
    name: userName,
  });

  token.addGrant({
    roomJoin: true,
    room: channelId,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return token.toJwt();
}

