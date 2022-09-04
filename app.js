require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');
const router = require('./routes');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://maria.diploma.nomoredomains.xyz',
    'https://maria.diploma.nomoredomains.xyz',
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

app.use(handleError);

app.listen(PORT);
