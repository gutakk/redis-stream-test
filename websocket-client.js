import WebSocket from 'ws';

if (process.argv[2] == null) {
  console.log('Please provide client name');
  process.exit(1);
}

const ws = new WebSocket('ws://localhost:8080');

ws.on('message', (data) => {
  console.log('received:', data.toString());
});

setInterval(() => {
  ws.send(process.argv[2]);
}, 1000);
