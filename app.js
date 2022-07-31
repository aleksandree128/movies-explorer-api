require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { userRouter } = require('./routes/user');
const { moviesRouter } = require('./routes/movie');
const NotFoundErrors = require('./code_errors/notFound-errors');
const { requestLogger, errorLogger } = require('./middlewares/loggers');
const cors = require('./middlewares/cors');

//const { NODE_ENV, MONGO_PATH, DB_CONNECT } = process.env;

const { PORT = 3001 } = process.env;
const app = express();
app.use(cors);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(auth);
app.use(auth, userRouter);
app.use(auth, moviesRouter);
app.use(auth, (req, res, next) => {
  next(new NotFoundErrors('Маршрут не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
