// Test script — verifies create/join/full/not-found/chat/signaling flows
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
  console.log('\n--- Room, Chat & WebRTC Signaling tests ---\n');

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

  // Test 6: Chat message broadcast to everyone including sender
  const chatPromiseA = waitFor(clientA, 'chat-message');
  const chatPromiseB = waitFor(clientB, 'chat-message');
  clientA.emit('chat-message', { text: 'Hello Bob!' });
  const [msgA, msgB] = await Promise.all([chatPromiseA, chatPromiseB]);

  assert(
    'client A receives own chat-message',
    msgA && msgA.text === 'Hello Bob!' && msgA.name === 'Alice' && msgA.id === clientA.id && typeof msgA.time === 'number'
  );
  assert(
    'client B receives chat-message from A',
    msgB && msgB.text === 'Hello Bob!' && msgB.name === 'Alice' && msgB.id === clientA.id && typeof msgB.time === 'number'
  );

  // Test 7: Empty or whitespace chat-message is ignored
  let emptyReceived = false;
  const onEmptyMessage = () => { emptyReceived = true; };
  clientA.on('chat-message', onEmptyMessage);
  clientB.on('chat-message', onEmptyMessage);
  clientA.emit('chat-message', { text: '   ' });
  clientA.emit('chat-message', { text: '' });
  await new Promise((r) => setTimeout(r, 200));
  clientA.off('chat-message', onEmptyMessage);
  clientB.off('chat-message', onEmptyMessage);
  assert('empty chat-message is ignored', emptyReceived === false);

  // Test 8: Offer relay (A sends offer -> B receives with from: A.id)
  const offerPromiseB = waitFor(clientB, 'offer');
  const dummyOffer = { type: 'offer', sdp: 'v=0 dummy offer sdp' };
  clientA.emit('offer', { sdp: dummyOffer });
  const offerReceived = await offerPromiseB;
  assert(
    'client B receives offer with right from and sdp',
    offerReceived && offerReceived.from === clientA.id && offerReceived.sdp?.sdp === dummyOffer.sdp
  );

  // Test 9: Answer relay (B sends answer -> A receives with from: B.id)
  const answerPromiseA = waitFor(clientA, 'answer');
  const dummyAnswer = { type: 'answer', sdp: 'v=0 dummy answer sdp' };
  clientB.emit('answer', { sdp: dummyAnswer });
  const answerReceived = await answerPromiseA;
  assert(
    'client A receives answer with right from and sdp',
    answerReceived && answerReceived.from === clientB.id && answerReceived.sdp?.sdp === dummyAnswer.sdp
  );

  // Test 10: ICE candidate relay (A sends candidate -> B receives with from: A.id)
  const icePromiseB = waitFor(clientB, 'ice-candidate');
  const dummyCandidate = { candidate: 'candidate:dummy', sdpMid: '0', sdpMLineIndex: 0 };
  clientA.emit('ice-candidate', { candidate: dummyCandidate });
  const iceReceived = await icePromiseB;
  assert(
    'client B receives ice-candidate with right from and candidate',
    iceReceived && iceReceived.from === clientA.id && iceReceived.candidate?.candidate === dummyCandidate.candidate
  );

  // Test 11: B leaves — A receives user-left
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
