import { io } from 'socket.io-client';

const socket = io('http://localhost:6060', {
  auth: {
    token: "{{SCREENCLOUD_API_TOKEN}}"
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

socket.on('connect', (arg) => {
  console.log('connected to server');
});

socket.on("connect_error", (err) => {
  console.log(err.message); // prints the message associated with the error
});

socket.on('synchronize', (data) => {
  if (!data) {
    console.log('no data');
    socket.emit('acknowledge', data);
    return;
  }

  console.log('received:', data[0]);

  sleep(100).then(() => {
    const ids = data[0].messages.map((v) => v.id);
    console.log('acknowledege data');
    socket.emit('acknowledge', ids)
  });
});
