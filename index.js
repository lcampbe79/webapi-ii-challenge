const express = require('express');

const dbRouter = require('./data/db-router');

const server = express();

server.use(express.json())

server.get('/', (req, res) => {
  res.send('Here comes the data');
});

server.use('/api/posts', dbRouter);

server.listen(4000, () => {
  console.log('Running on 4000');
});
