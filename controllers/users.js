const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ReqErrors = require('../code_errors/req-errors');
const AuthErrors = require('../code_errors/AuthErrors');
const ConflictedErrors = require('../code_errors/conflicted-errors');
const NotFoundError = require('../code_errors/notFound-errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('Введенные данные некорректны.'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictedErrors('Пользователь с указанным email уже существует. Попробуйте еще.'));
        return;
      }
      next(err);
    });
};

const getUserI = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        email,
        password: hash,
      },
    ))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('Введенные данные некорректны.'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictedErrors('Пользователь с таким email уже существует.'));
        return;
      }
      next(err);
    });
};

const getlogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthErrors('Неверно введен пароль или почта');
      }
      const token = jwt.sign({
        _id: user._id,
      }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getlogin,
  getUserI,
  getUsers,
  createUser,
};
