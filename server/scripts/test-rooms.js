// Temporary test script — verifies create/join/full/not-found flows
// Run with: node scripts/test-rooms.js (server must be running on port 5000)
import { io } from 'socket.io-client';

const URL = 'http://localhost:5000';
let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL: ${label}`);
    failed++;
  }
}

function connect() {
  return io(URL, { autoConnect: true });
}

function waitFor(socket, event) {
  return new Promise((resolve) => socket.once(event, resolve));
}

async function run() {
  console.log('\n--- Room tests ---\n');

  const clientA = connect();
  const clientB = connect();
  const clientC = connect();

  await Promise.all([
    waitFor(clientA, 'connect'),
    waitFor(clientB, 'connect'),
    waitFor(clientC, 'connect'),
  ]);

  // Test 1: A creates a room
  const createRes = await new Promise((r) => clientA.emit('create-room', r));
  assert('create-room returns ok:true and a roomId', createRes.ok && typeof createRes.roomId === 'string');
  const roomId = createRes.roomId;

  // Test 2: A joins the room it just created
  const joinA = await new Promise((r) => clientA.emit('join-room', { roomId, name: 'Alice' }, r));
  assert('client A joins successfully', joinA.ok === true);
  assert('join ack includes users array', Array.isArray(joinA.users));

  // Test 3: B joins — A receives user-joined
  const userJoinedPromise = waitFor(clientA, 'user-joined');
  const joinB = await new Promise((r) => clientB.emit('join-room', { roomId, name: 'Bob' }, r));
  assert('client B joins successfully', joinB.ok === true);
  const joined = await userJoinedPromise;
  assert('client A receives user-joined with Bob\'s name', joined.name === 'Bob');

  // Test 4: C tries to join — room is full
  const joinC = await new Promise((r) => clientC.emit('join-room', { roomId, name: 'Carol' }, r));
  assert('client C gets ROOM_FULL', joinC.ok === false && joinC.error === 'ROOM_FULL');

  // Test 5: fake room ID → ROOM_NOT_FOUND
  const joinFake = await new Promise((r) => clientC.emit('join-room', { roomId: 'fakeid!', name: 'X' }, r));
  assert('fake roomId gets ROOM_NOT_FOUND', joinFake.ok === false && joinFake.error === 'ROOM_NOT_FOUND');

  // Test 6: B leaves — A receives user-left
  const userLeftPromise = waitFor(clientA, 'user-left');
  clientB.emit('leave-room');
  const left = await userLeftPromise;
  assert('client A receives user-left when B leaves', left.name === 'Bob');

  clientA.disconnect();
  clientB.disconnect();
  clientC.disconnect();

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
