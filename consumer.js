import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('stream', (data) => {
  if (!data) {
    socket.emit('x', data);
    return;
  }

  console.log('received:', data[0]);

  sleep(5000).then(() => {
    socket.emit('x', data[0].messages)
  });
});

// import WebSocket from 'ws';

// const ws = new WebSocket('ws://localhost:8080');

// ws.on('open', () => {
//   console.log('connected to websocket server');
// })

// ws.on('message', async (data) => {
//   if (data.length != 0) {
//     let typeA, typeB, typeC;
//     // [ { name: 'test-stream', messages: [ [Object] ] } ]
//     const parsedData = JSON.parse(data);
//     console.log('===== data length:', parsedData.length);
//     console.log('===== messages length:', parsedData[0].messages.length); // Data length of one batch

//     parsedData.map((v) => {
//       // console.log(v);
//       // [ { id: '1645764183051-0', message: { id: '1', type: 'B' } } ]
//       typeA = v.messages.filter((x) => x.message.type == 'A');
//       typeB = v.messages.filter((x) => x.message.type == 'B');
//       typeC = v.messages.filter((x) => x.message.type == 'C');

//       ws.send({type:'Acknowledge', id});
//     });
//     console.log('type A', typeA);
//     console.log('type B', typeB);
//     console.log('type C', typeC);
//   } else {
//     console.log('no data in redis');
//   }
// });
