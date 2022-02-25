import { createClient } from "redis";

function getRandom (list) {
  return list[Math.floor((Math.random()*list.length))];
}

(async () => {
  const client = createClient({url: "redis://localhost:46379/0"});

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  const rand = ['A', 'B', 'C'];

  setInterval(async () => {
    for (let i=1; i<=100; i++) {
      const data = {
        id: i,
        type: getRandom(rand)
      };
      await client.xAdd('test-stream', '*', data);
      console.log('added', data);
    }
  }, 2000);
})();