import { createClient } from 'redis';

(async () => {
  const client = createClient({ url: 'redis://localhost:46379/0' });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  const ids = [
    'xxxxxxxx-xxxx-xxth-bkkx-856738600641',
    'xxxxxxxx-xxxx-xxth-bkkx-750630114775',
    'xxxxxxxx-xxxx-xxth-bkkx-738156777998',
    'xxxxxxxx-xxxx-xxth-bkkx-266814562608',
    'xxxxxxxx-xxxx-xxth-bkkx-135654505895',
    'xxxxxxxx-xxxx-xxth-bkkx-75272938801',
    'xxxxxxxx-xxxx-xxth-bkkx-605266131710',
    'xxxxxxxx-xxxx-xxth-bkkx-682852500808',
    'xxxxxxxx-xxxx-xxth-bkkx-583142591932'
  ]

  // event_name:
  // player_id
  // connection_state
  // connected_at
  // disconnected_at
  await Promise.all(ids.map((id) => client.xAdd('screen-status-event-stream', '*', {
    event_name: 'PLAYER_CONNECTION_STATE',
    player_ids: [id],
    connection_state: 'online',
    connected_at: new Date().toString(),
    disconnected_at: null
  })))


  console.log('added');
  process.exit(0);
})();