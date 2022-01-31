require('dotenv').config()
const express = require('express');
var cors = require('cors');
const { Server } = require("socket.io");
const Queue = require('bull');
const _ = require('lodash');
const app = express();
const createClient = require('redis').createClient;
const client = createClient({ url: process.env.REDIS_DB_CONNECTION_STRING });
client.on('error', (err) => console.log('Redis Client Error', err));
const voteQueue = new Queue('vote', process.env.REDIS_CONNECTION_STRING);

const server = require('http').createServer(app);
const io = new Server(server, {
  path: '/socket.io',
  secure: true,
  transports: ['websocket',  'polling'],
  cors: {
    origin: '*',
  }
});

let connected = {};
let votes = {};
let lastUpdateVotes = {};
let connectedIps = {};

const candidates = [
  "siulungling",
  "hannachanx",
  "kakisham",
  "yoshi",
  "chancharmman",
  "llokmann",
  "frankie",
  "victorbb",
  "locker",
  "kearenpang",
  "siumong",
  "stanleysc",
  "roserosemama",
  "matthewthehan",
  "alanlongjai",
  "alvinwanwingkit",
  "lulutung",
  "siuyea_lo",
  "atm",
  "ivyhkactress",
  "cheongfat",
  "shiincheung",
  "pixelivan",
  "iamkevli",
  "johntsangpage",
  "fungblackandwhite",
  "aerochow",
  "wingcheong",
  "sabrinasa",
  "jeffreyngai",
  "anjaylia",
  "mixsonwong",
  "wongyatho",
  "linkuen",
  "misselvani",
  "gladys",
  "alinaln",
  "bubermak",
  "cheeth",
  "tinchakleung",
  "Edwardthk",
  "chun123hk",
  "ryuichi",
  "rexleyxraina",
  "ballfaiyau",
  "gabrielch",
  "deansiu",
  "jimsiujim",
  "johnee",
  "zachary",
]

app.use(cors());

app.get('/ping', function(req, res) {
	return res.send('pong');
});

app.get('/snapshot', function(req, res) {
  return res.json(votes);
})

io.on('connection', socket => {
  connected[socket.id] = [socket, null];
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.request.socket.remoteAddress;
  if (!connectedIps[ip]) {
    connectedIps[ip] = [];
  }
  (connectedIps[ip]).push(socket);
  connectedIps[ip] = (connectedIps[ip]).filter(c => !!c);
  if ((connectedIps[ip]).length > 5) {
    if (connectedIps[ip][0]) {
      (connectedIps[ip][0]).disconnect();
      delete connectedIps[ip][0];
    }
    console.log(socket.handshake.address, 'reach max connection, kill the first connected client');
    console.log(`${(connectedIps[ip][1])?.id} 1`);
    console.log(`${(connectedIps[ip][2])?.id} 2`);
    console.log(`${(connectedIps[ip][3])?.id} 3`);
    console.log(`${(connectedIps[ip][Object.keys(connectedIps).length -1])?.id} last`);
  }
  console.log(socket.id, ip,'connected');

  socket.on("disconnect", (reason) => {
    const ip = socket.handshake.headers['x-forwarded-for'] || socket.request.socket.remoteAddress;
    let count = 0;
    connectedIps[ip].forEach((s, i) => {
      if (!!s && s.id === socket.id) {
        delete connectedIps[ip][i];
        console.log(socket.id, ip, 'disconnected', Object.keys(connectedIps).length, 'total_ip', Object.keys(connected).length, 'total_connection');
      } else {
        if (!!s) count = count + 1;
      }
    })
    if (count === 0) {
      delete connectedIps[ip];
    }
  });

  socket.on('vote', (data) => {
    console.log('vote', data.to, data.count);
    if (!data.to || !data.count || data.count <= 0) { return }
    if (data.count > 10) data.count = 10;
    if (connected[socket.id] && connected[socket.id][1]) {
      if (Date.now() - connected[socket.id][1] <= 500) {
        console.log(socket.id, 'bam');
        return connected[socket.id][0].disconnect(true) // boom
      }
    }
    connected[socket.id][1] = Date.now();
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
    // console.log('l', lastUpdateVotes);
    // console.log('v', votes);
    console.log('d', diff);
    Object.keys(connected).forEach( k => {
      connected[k][0].emit('diff', diff);
    })
    lastUpdateVotes = _.clone(votes);
  }
  setTimeout(async () => { await updateVote(client) }, 200);
}

(async () => {
  await client.connect();
  await updateVote(client);
  server.listen(process.env.SERVER_PORT, function() {
    console.log(`rocking at ${process.env.SERVER_PORT} port`);
  });
})();
