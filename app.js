/* eslint-disable no-unused-vars */
const express = require('express');
const { calcSaveTable } = require('./libs/calcSaveTable');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const a = calcSaveTable({
  numOfServers: 4,
  maxFilesProcessAtOnce: 1,
  maxFilesProcessPerServer: 1,
  maxInactiveServers: 1,
  initialNumOfFiles: 8,
});
app.use(express.static('public'));

app.use('/upload', require('./controllers/upload'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
