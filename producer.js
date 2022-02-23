import { createClient } from 'redis';

(async () => {
  const client = createClient({url: 'redis://localhost:46379/0'});
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.eval("redis.call('xadd', 'mystream', '*', 'test', 'hello', 'hello', 'world')", 0)
})();
