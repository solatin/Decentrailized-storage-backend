/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { calcSaveTable } = require('./libs/calcSaveTable');
const findFiles = require('./libs/findFileLocation');

const SaveTable = require('./models/saveTable');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.static('public'));

app.use('/upload', require('./controllers/upload'));

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.jqf7i.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
);
mongoose.connection.once('open', async (ref) => {
  console.log('Connected to mongo server!');
});

app.get('/saveTable', async (req, res) => {
  const [saveTable] = await SaveTable.find();

  res.json(JSON.parse(saveTable.value));
});

app.post('/set-up', async (req, res) => {
  const {
    numOfServers,
    initialNumOfFiles,
    maxInactiveServers,
    maxFilesProcessAtOnce = 1,
    maxFilesProcessPerServer = 1,
  } = req.body;
  const value = calcSaveTable({
    numOfServers,
    maxInactiveServers,
    initialNumOfFiles,
    maxFilesProcessAtOnce,
    maxFilesProcessPerServer,
  });
  console.log(numOfServers, maxInactiveServers, initialNumOfFiles);
  SaveTable.remove({});
  const saveTable = new SaveTable({ value: JSON.stringify(value) });

  saveTable.save();
  res.json(value);
});

app.post('/find', async (req, res) => {
  const saveTableInstance = await SaveTable.findOne();
  const saveTable = JSON.parse(saveTableInstance.value);
  const { fileList, inactiveServerList } = req.body;
  const result = findFiles({
    saveTable,
    fileList,
    initialNumOfFiles: saveTable[0].length,
    numOfServers: saveTable.length,
    maxFilesProcessPerServer: 1,
    maxFilesProcessAtOnce: 1,
    inactiveServerList,
  });
  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
