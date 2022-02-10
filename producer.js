import { createClient } from "redis";

(async () => {
  const client = createClient({url: "redis://localhost:46379/0"});

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  for(let i=0; i<10; i++) {
    await client.xAdd('test-stream', '*', {
      id: i
    })
  }

  await client.xRead
})();
