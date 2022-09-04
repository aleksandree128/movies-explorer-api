const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const { validationCreateUser, validationLogin } = require('../middlewares/validations');
const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signup', validationCreateUser, createUser);

router.post('/signin', validationLogin, login);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFound('Неправильный путь. Error 404'));
});

module.exports = router;
