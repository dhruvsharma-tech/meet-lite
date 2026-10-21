import { randomUUID } from 'crypto';

// Map<roomId, { users: Map<socketId, { name }>, createdAt: number, lastActive: number }>
const rooms = new Map();

// Generate a short random room ID and store an empty room
export function createRoom() {
  const roomId = randomUUID().slice(0, 8);
  rooms.set(roomId, {
    users: new Map(),
    createdAt: Date.now(),
    lastActive: Date.now(),
  });
  return roomId;
}

// Return the room object or undefined
export function getRoom(roomId) {
  return rooms.get(roomId);
}

// Add a user to a room and update lastActive
export function addUser(roomId, socketId, name) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.users.set(socketId, { name });
  room.lastActive = Date.now();
}

// Remove a user by socketId from whichever room they are in
// Returns { roomId, name } if found, null otherwise
export function removeUser(socketId) {
  for (const [roomId, room] of rooms) {
    if (room.users.has(socketId)) {
      const { name } = room.users.get(socketId);
      room.users.delete(socketId);
      room.lastActive = Date.now();
      return { roomId, name };
    }
  }
  return null;
}

// Find the room a socket is currently in
// Returns { roomId, room } or null
export function findRoomBySocket(socketId) {
  for (const [roomId, room] of rooms) {
    if (room.users.has(socketId)) {
      return { roomId, room };
    }
  }
  return null;
}

// Delete rooms that are empty and inactive for more than 10 minutes
export function cleanupEmptyRooms() {
  const TEN_MINUTES = 10 * 60 * 1000;
  const now = Date.now();
  for (const [roomId, room] of rooms) {
    if (room.users.size === 0 && now - room.lastActive > TEN_MINUTES) {
      rooms.delete(roomId);
    }
  }
}

// Run cleanup every 5 minutes — call once at server startup
export function startRoomCleanup() {
  setInterval(cleanupEmptyRooms, 5 * 60 * 1000);
}
