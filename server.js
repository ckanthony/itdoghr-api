require('dotenv').config()
const express = require('express');
var cors = require('cors');
const { Server } = require("socket.io");
const Queue = require('bull');
const _ = require('lodash');
const app = express();
const createClient = require('redis').createClient;
const client = createClient({ url: process.env.REDIS_CONNECTION_STRING });
client.on('error', (err) => console.log('Redis Client Error', err));
const voteQueue = new Queue('vote', process.env.REDIS_CONNECTION_STRING);

const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

let connected = {};
let votes = {};
let lastUpdateVotes = {};

const candidates = [
  'lemon',
  'seon',
]

app.use(cors());

app.get('/ping', function(req, res) {
	return res.send('pong');
});

app.get('/snapshot', function(req, res) {
  return res.json(votes);
})

io.on('connection', socket => {
  connected[socket.id] = socket;
  console.log(`${socket.id} connected`);

  socket.on('vote', (data) => {
    console.log('vote', data.to, data.count);
    if (!data.to || !data.count || data.count <= 0) { return }
    if (!candidates.includes(data.to)) { return }
    voteQueue.add({
      who: data.to,
      count: data.count,
    });
  })

	socket.on('disconnect', () => {
    delete connected[socket.id];
	});
})

async function updateVote(client) {
  votes = JSON.parse(await client.get('votes'));
  const diff = _.omitBy(votes, function(v,k) { return lastUpdateVotes[k] === v; });
  if (Object.keys(diff).length > 0) {
    console.log('l', lastUpdateVotes);
    console.log('v', votes);
    console.log('d', diff);
    Object.keys(connected).forEach( k => {
      connected[k].emit('diff', diff);
    })
    lastUpdateVotes = _.clone(votes);
  }
  setTimeout(async () => { await updateVote(client) }, 2000);
}

(async () => {
  await client.connect();
  await updateVote(client);
  server.listen(process.env.SERVER_PORT, function() {
    console.log(`rocking at ${process.env.SERVER_PORT} port`);
  });
})();
