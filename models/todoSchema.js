const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todo = new Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  key: {
    type: Date,
    required: true
  }

});

module.exports = mongoose.model('todoSchema', todo);