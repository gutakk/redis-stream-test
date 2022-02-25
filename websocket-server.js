import { createClient, commandOptions } from 'redis';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 })
const client = createClient({url: "redis://localhost:46379/0"});
await client.connect();

try {
  await client.xGroupCreate('test-stream', 'myconsumergroup', '0', {
    MKSTREAM: true
  });
  console.log('Created consumer group.');
} catch (e) {
  console.log('Consumer group already exists, skipped creation.');
}


wss.on('connection', async (ws) => {
  let breakLoop = false;
  ws.on('close', () => {
    console.log('disconnected');
    breakLoop = true;
  });

  while (true) {
    if (breakLoop) return;

    const result = await consume('test-stream');
    ws.send(result);
  }
});

async function consume(streamName) {
  try {
    let response = await client.xReadGroup(
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
      return JSON.stringify(response);
    } else {
      console.log('No data in Redis stream');
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}
