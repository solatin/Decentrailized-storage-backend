const express = require('express');

const router = express.Router();

const multer = require('multer');

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

router.post('/single', upload.single('file'), (req, res, next) => {
  const { file } = req;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    next(error);
  } else {
    res.send(file);
  }
});

module.exports = router;
