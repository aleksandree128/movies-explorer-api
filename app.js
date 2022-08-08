require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const mainError = require('./code_errors/mainError');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/loggers');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();
const options = {
  origin: [
    'http://localhost:3000',
    'http://korshinov.diplom.nomoredomains.sbs',
    'https://korshinov.diplom.nomoredomains.sbs',
  ],
  credentials: true,
};
app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use(requestLogger);

app.use(helmet());

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(mainError);

app.listen(PORT);
