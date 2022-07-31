const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
}), getUsers);

module.exports.userRouter = router;
