const NotFoundError = require('../Errors/not-found-error');
const NotValidError = require('../Errors/not-valid-error');
const NotAllowedError = require('../Errors/not-allowed-error');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((c) => res.send(c))
    .catch(next);
};

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((c) => res.send(c))
    .catch(next);
};

module.exports.addCardLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((c) => {
      if (!c) {
        throw new NotFoundError('There is no such card');
      }
      res.send(c);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Not valid');
      }
      throw err;
    })
    .catch(next);
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId).then((c) => {
    if (!c) {
      throw new NotFoundError('There is no such card');
    }
    if (c.owner.toString() !== req.user._id) {
      throw new NotAllowedError('User is not allowed to delete the card');
    }
    Card.deleteOne(c)
      .then(() => res.send({ message: 'Card was deleted' }))
      .catch(next);
  })
    .catch(next);
};

module.exports.removeCardLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((c) => {
      if (!c) {
        throw new NotFoundError('There is no such card');
      }
      res.send(c);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Validation error');
      }
      throw err;
    })
    .catch(next);
};
