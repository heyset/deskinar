require('dotenv').config();
const express = require('express');
const cors = require('cors');
const next = require('next');
const Pusher = require('pusher');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  encrypted: true,
});

function saveThreadHistory(threadHistory) {
  try {
    const json = JSON.stringify(threadHistory);
    fs.writeFileSync('./thread-history.json', json);
  } catch (err) {
    throw new Error(err);
  }
}

function getThreadHistory() {
  try {
    const retrievedThreadHistory = fs.readFileSync('./thread-history.json');
    const parsed = JSON.parse(retrievedThreadHistory);
    return parsed;
  } catch (err) {
    return [];
  }
}

app.prepare().then(() => {
  const server = express();

  server.use(
    express.json(),
    express.urlencoded({ extended: true }),
  );

  server.get('/thread-history', cors(), (req, res) => {
    const threadHistory = getThreadHistory();

    if (threadHistory.length) {
      return res.status(200).json(threadHistory);
    } else {
      return res.status(404).json([]);
    }

  });

  server.post('/new-thread', cors(), (req, res) => {
    const threadHistory = getThreadHistory();
    const thread = req.body;

    thread.id = uuid();
    thread.op.timestamp = new Date();

    threadHistory.push(req.body);

    try {
      saveThreadHistory(threadHistory);
      pusher.trigger('deskinar', 'new-thread', thread);
      return res.status(201);
    } catch(err) {
      return res.status(400);
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;

    console.log(`> Ready on https://localhost:${port}`);
  });
});
