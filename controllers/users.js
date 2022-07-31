const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ReqErrors = require('../code_errors/req-errors');
const AuthErrors = require('../code_errors/AuthErrors');
const ConflictedErrors = require('../code_errors/conflicted-errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        email,
        password: hash,
      },
    ))
    .then(() => res.send(
      {
        name,
        _id,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('incorrect data'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictedErrors('A user with this email address already exists'));
        return;
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then(() => {
      res.send({
        name,
        email,
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  const { _id } = req.user;
  User.findOne(
    { _id },
  )
    .then(() => {
      res.send({
        name,
        email,
      });
    })
    .catch(next);
};

const getlogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((users) => {
      if (!users) {
        // перейдём в .catch, отклонив промис
        throw new AuthErrors('неверный пользователь или пароль');
      }
      return bcrypt.compare(password, users.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthErrors('неверный пользователь или пароль');
          }
          return users;
        });
    })
    .then((data) => {
      res.send({
        token: jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getlogin,
  getUser,
  getUsers,
  createUser,
};
