const PORT = '3000';
const DB_PORT = '27017';
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { addUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const exceptionHandler = require('./middlewares/exception-handler');
const NotFoundError = require('./Errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({
  origin: ['http://frontend.nomoredomains.work', 'https://frontend.nomoredomains.work', 'http://localhost:3001'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }), login);
app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/(www\.)?[\w\d-]+\.[\w\d-.~:/?#[\]@!$&'()*+,;=]+#?/),
    }),
  }), addUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/', () => { throw new NotFoundError('Resource not found'); });

mongoose.connect(`mongodb://localhost:${DB_PORT}/mestodb`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(errorLogger);

app.use(errors());
app.use(exceptionHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${PORT}`);
});
