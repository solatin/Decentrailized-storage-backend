const mongoose = require('mongoose');

const { Schema } = mongoose;

const saveTableSchema = new Schema(
  {
    value: {
      type: String,
    },
  },
  { collection: 'saveTable' }
);

module.exports = mongoose.model('saveTable', saveTableSchema);
