import { io } from 'socket.io-client';

const socket = io('http://localhost:6060');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('stream', (data) => {
  if (!data) {
    socket.emit('acknowledge socket', data);
    return;
  }

  console.log('received:', data[0]);

  sleep(5000).then(() => {
    socket.emit('acknowledge socket', data[0].messages)
  });
});
