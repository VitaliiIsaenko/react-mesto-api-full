const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: () => 'Card link is not valid',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    requried: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    required: true,
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
