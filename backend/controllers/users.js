const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../Errors/not-found-error');
const NotValidError = require('../Errors/not-valid-error');
const AlreadyExistsError = require('../Errors/already-exists-error');

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotValidError('Validation error');
      }
      throw err;
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((u) => res.send(u))
    .catch(next);
};

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((u) => res.status(200).send({
      name: u.name, about: u.about, avatar: u.avatar, email: u.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      if (err.code === 11000) {
        throw new AlreadyExistsError('User with this email already exists');
      }
      throw err;
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      throw err;
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError(err.message);
      }
      throw err;
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((u) => {
      if (!u) {
        throw new NotFoundError('There is no such user');
      }
      res.send(u);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { SECRET_KEY = 'secret-key' } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const sevenDays = 7 * 24 * 60 * 60;
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: sevenDays });
      res.send({ token });
    })
    .catch(next);
};
