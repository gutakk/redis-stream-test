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

wss.on('connection', (ws) => {
  ws.on('message', async (data) => {
    const jsonParams = JSON.parse(data);
    const result = await consume(jsonParams.streamName);
    ws.send(result);
  });

  ws.send('connected to websocket server');
});

async function consume(streamName, id) {
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
        COUNT: 1,
        BLOCK: 5000
      }
    );

    if (response) {
      return JSON.stringify(response);
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}
