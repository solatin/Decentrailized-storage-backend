const mongoose = require('mongoose');

const { Schema } = mongoose;

const fileInfoSchema = new Schema(
  {
    fileIndex: {
      type: Number,
    },
    name: {
      type: String,
    },
  },
  { collection: 'fileInfo' }
);

module.exports = mongoose.model('fileInfo', fileInfoSchema);
