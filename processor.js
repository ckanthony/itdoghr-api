require('dotenv').config()
const Queue = require('bull');
const createClient = require('redis').createClient;
const client = createClient({ url: process.env.REDIS_DB_CONNECTION_STRING });
client.on('error', (err) => console.log('Redis Client Error', err));

const voteQueue = new Queue('vote', process.env.REDIS_CONNECTION_STRING);
let votes = {};

(async () => {
  await client.connect();
  votes = JSON.parse(await client.get('votes')) || {};

  voteQueue.process(async function (job, done) {
    console.log('processing vote')
    console.log(job.data)
    votes[job.data.who] = votes[job.data.who] + job.data.count || job.data.count;
    console.log(votes)
    await client.set('votes', JSON.stringify(votes));
    done();
  });
})();