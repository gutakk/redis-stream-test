import { createClient, commandOptions } from 'redis';
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server);
server.listen(3000);

const redisClient = createClient({url: "redis://localhost:46379/0"});
await redisClient.connect();

try {
  await redisClient.xGroupCreate('test-stream', 'myconsumergroup', '0', {
    MKSTREAM: true
  });
  console.log('Created consumer group.');
} catch (e) {
  console.log('Consumer group already exists, skipped creation.');
}


io.on('connection', async (socket) => {
  let breakWhile = false;
  console.log(`socket ${socket.id} has been connected`);

  socket.on('disconnect', reason => {
    console.log(`socket ${socket.id} has been disconnected:`, reason);
    breakWhile = true;
  });

  socket.on('acknowledge socket', async (data) => {
    if(data) {
      const ids = data.map((v) => v.id);
      const ackResult = await redisClient.xAck('test-stream', 'myconsumergroup', ids)
      console.log('Acknowledge result:', ackResult);
    }

    const result = await consume('test-stream');
    if (result) {
      console.log('\nEmit data to socket');
      socket.emit('stream', result)
    } else {
      while (true) {
        if (breakWhile) break;
        const result = await consume('test-stream');
        if (result) {
          console.log('\nEmit data to socket');
          socket.emit('stream', result);
          break;
        }
      }
    }
  });

  const result = await consume('test-stream');
  console.log('\nEmit data to socket');
  socket.emit('stream', result);
});

async function consume(streamName) {
  try {
    let response = await redisClient.xReadGroup(
      commandOptions({
        isolated: true
      }),
      'myconsumergroup', 
      'myconsumer', [{
        key: streamName,
        id: '>' // Next entry ID that no consumer in this group has read
      }], {
        COUNT: 10,
        BLOCK: 5000
      }
    );

    if (response) {
      return response;
    } else {
      console.log('No data in Redis stream');
      return null
    }
  } catch (err) {
    console.error(err);
  }
}
