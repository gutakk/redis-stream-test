import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('message', (data) => {
  if (data != '') {
    console.log('received:', data.toString());
  } else {
    console.log('no data in redis');
  }
});

ws.on('open', () => {
  setInterval(() => {
    const params = {
      streamName: 'test-stream'
    }
    ws.send(JSON.stringify(params));
  }, 0);
});
