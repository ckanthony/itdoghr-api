require('dotenv').config()
const Queue = require('bull');
const createClient = require('redis').createClient;
const client = createClient({ url: process.env.REDIS_DB_CONNECTION_STRING });
client.on('error', (err) => console.log('Redis Client Error', err));

const voteQueue = new Queue('vote', process.env.REDIS_CONNECTION_STRING);
const voteSaveQueue = new Queue('voteToSave', process.env.REDIS_CONNECTION_STRING);
let votes = {};
let wait = 0;

async function mergeVotes() {
  wait = wait + 1;
  const queueCount = await voteQueue.count();
  if (await queueCount > 100 ||
      (wait === 2 && await queueCount > 0)) {
    wait = 0;
    const jobs = await voteQueue.getJobs();
    jobs.forEach(function (job) {
      if (job) {
        votes[job.data.who] = votes[job.data.who] + job.data.count || job.data.count;
      }
    })
    await voteSaveQueue.add({ votes });
    await Promise.all(jobs.map(job => !!job && job.remove()));
  }
  if (wait === 2) wait = 0;
  setTimeout(() => mergeVotes(), 500);
}


(async () => {
  await client.connect();
  votes = JSON.parse(await client.get('votes')) || {};

  mergeVotes();

  voteSaveQueue.process(async function (job, done) {
    console.log('redis', job.data.votes);
    await client.set('votes', JSON.stringify(job.data.votes));
    done();
  });
})();
