const express = require('express');

const router = express.Router();

const multer = require('multer');
const FileInfo = require('../models/fileInfo');
const SaveTable = require('../models/saveTable');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res, next) => {
  const { file } = req;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    next(error);
  } else {
    try {
      const fileList = await FileInfo.find();
      const fileIndex = fileList.length;
      const newFile = new FileInfo({ fileIndex, name: file.originalname });
      newFile.save();

      // save file to child server
      const saveTableInstance = await SaveTable.findOne();
      const saveTable = JSON.parse(saveTableInstance.value);

      const initialNumOfFiles = saveTable[0].length;
      const numOfServers = saveTable.length;
      const saveFileIndex = fileIndex % initialNumOfFiles;
      const saveServerList = [];
      for (let i = 0; i < numOfServers; i++) {
        if (saveTable[i][saveFileIndex]) {
          saveServerList.push(i);
        }
      }
      // console.log('list of servers to save file: ', saveServerList);
      res.json({ fileInfo: newFile, saveServer: saveServerList });
    } catch (e) {
      console.log(e);
      res.status(404).send(e);
    }
  }
});

module.exports = router;
