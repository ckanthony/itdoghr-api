require('dotenv').config();
const createClient = require('redis').createClient;
const client = createClient({ url: process.env.REDIS_CONNECTION_STRING });
client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await client.connect();
  await client.del('votes');
  console.log('removed')
  return client.quit();
})();
